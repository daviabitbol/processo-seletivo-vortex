import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';
import { encryptText, decryptText } from './crypto.util';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    console.log(`Cliente ${client.id} entrou na sala ${data.room}`);

    const history = await this.messageRepository.find({
      where: { room: data.room },
      order: { createdAt: 'ASC' },
    });

    const decryptedHistory = history.map((msg) => ({
      ...msg,
      content: decryptText(msg.content),
    }));

    client.emit('chat_history', decryptedHistory);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { room: string; senderId: string; content: string },
  ) {

    const encryptedContent = encryptText(data.content);

    const newMessage = this.messageRepository.create({
      room: data.room,
      senderId: data.senderId,
      content: encryptedContent,
    });

    const savedMessage = await this.messageRepository.save(newMessage);

    const messageToSend = {
      ...savedMessage,
      content: data.content,
    };

    this.server.to(data.room).emit('receive_message', messageToSend);
  }

  @SubscribeMessage('get_my_chats')
  async handleGetMyChats(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ) {
    
    const messages = await this.messageRepository
      .createQueryBuilder("message")
      .select("DISTINCT message.room", "room")
      .where("message.room LIKE :search", { search: `%#${data.username}#%` })
      .getRawMany();

    const rooms = messages.map(m => m.room);
    client.emit('my_chats_list', rooms);
  }
}