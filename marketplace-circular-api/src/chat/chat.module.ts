import { Module } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([MessageEntity])],
    providers: [ChatGateway]
})
export class ChatModule {}
