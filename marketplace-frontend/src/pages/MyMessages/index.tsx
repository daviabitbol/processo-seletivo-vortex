import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Chat } from '../../components/Chat/Chat';
import './style.css';
import { HomeButton } from '../../components/Buttons/HomeButton/HomeButton';

const SOCKET_URL = 'http://localhost:3000';

export function MyMessages() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeChats, setActiveChats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const initialRoom = location.state?.room;
  
  const currentUserUsername = localStorage.getItem('username') || '';

  useEffect(() => {
    if (initialRoom) {
      setLoading(false);
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      newSocket.emit('get_my_chats', { username: currentUserUsername });
    });

    newSocket.on('my_chats_list', (rooms: string[]) => {
      setActiveChats(rooms);
      setLoading(false);
    });

    return () => {
      newSocket.off('connect');
      newSocket.off('my_chats_list');
      newSocket.disconnect();
    };
  }, [initialRoom, currentUserUsername]);

  if (initialRoom) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <HomeButton />
        <Chat initialRoom={initialRoom} currentUsername={currentUserUsername} />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', marginBottom: '20px' }}>
        <HomeButton />
      </div>

      <h2>Meus Chats</h2>

      <div style={{ width: '100%', maxWidth: '500px', marginTop: '20px', backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Carregando seus chats...</p>
        ) : activeChats.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontSize: '1.1rem', margin: '40px 0' }}>
            você não tem nenhum chat ativo
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {activeChats.map((room) => {
              const parts = room.split('#').filter(Boolean);
              const seller = parts[1];
              const buyer = parts[2];
              
              const otherPerson = currentUserUsername === seller ? buyer : seller;
              const role = currentUserUsername === seller ? 'Anúncio seu' : 'Interesse seu';

              return (
                <li
                  key={room}
                  onClick={() => navigate('/my-messages', { state: { room } })}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f8ff'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ fontSize: '24px' }}>💬</div>
                  <div>
                    <strong style={{ display: 'block', color: '#333' }}>
                      {role}: Conversa com @{otherPerson}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                      Clique para abrir a conversa
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

      </div>
    </div>
  );
}