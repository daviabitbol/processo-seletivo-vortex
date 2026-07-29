import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./Chat.css";

interface Message {
  id: string;
  room: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface ChatProps {
  initialRoom?: string;
  currentUsername?: string | null;
}

const SOCKET_URL = "http://localhost:3000";

export const Chat = ({
  initialRoom = "sala-padrao",
  currentUsername,
}: ChatProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room] = useState<string>(initialRoom);

  // Define o remetente com o usuário logado ou lê do localStorage se não foi passado por prop
  const senderId =
    currentUsername || localStorage.getItem("username") || "usuario-anonimo";

  const [content, setContent] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
  const newSocket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: true,
  });

  setSocket(newSocket);

  newSocket.on('connect', () => {
    newSocket.emit('join_room', { room });
  });

  newSocket.on('chat_history', (historyMessages: Message[]) => {
    setMessages(historyMessages);
  });

  newSocket.on('receive_message', (savedMessage: Message) => {
    setMessages((prev) => [...prev, savedMessage]);
  });

  return () => {
    newSocket.off('connect');
    newSocket.off('chat_history');
    newSocket.off('receive_message');
    newSocket.disconnect();
  };
}, [room]);

  const handleSendMessage = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!socket || !content.trim()) return;

    const payload = {
      room,
      senderId,
      content,
    };

    socket.emit("send_message", payload);

    setContent("");
  };

  return (
    <div className="chat-container">
      <div className="room-info">
        Sala: <strong>{room}</strong> | Você: <strong>@{senderId}</strong>
      </div>

      <div className="messages-box">
        {messages.length === 0 ? (
          <span className="empty-messages">
            Envie uma mensagem para iniciar a conversa!
          </span>
        ) : (
          messages.map((msg) => {
            const isMyMessage = msg.senderId === senderId;
            return (
              <div
                key={msg.id}
                className={`message-wrapper ${isMyMessage ? "sent" : "received"}`}
              >
                <div className="message-bubble">
                  <span className="message-sender">@{msg.senderId}</span>
                  <p className="message-content">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          className="input-field"
          type="text"
          placeholder="Digite sua mensagem..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn-primary" type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
};
