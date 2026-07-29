import { useNavigate } from 'react-router-dom';
import './GoToMyAnnouncesButton.css'

export const GoToMyAnnouncesButton = () => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/create-item')
  };

  return (
    <button onClick={handleClick} className="go-to-my-announces-button">
      <p>Ir para meus anúncios</p>
    </button>
  );
};