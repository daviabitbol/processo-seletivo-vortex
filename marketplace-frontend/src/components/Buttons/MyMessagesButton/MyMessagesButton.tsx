import { useNavigate } from "react-router-dom";
import './MyMessagesButton.css'

export const MyMessagesButton = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button className="chat-button" onClick={() => navigate("/my-messages")}>
        💬 Ver meus chats
      </button>
    </div>
  );
};
