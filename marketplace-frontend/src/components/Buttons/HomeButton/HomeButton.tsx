import { useNavigate } from 'react-router-dom';
import './HomeButton.css'

export const HomeButton = () => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/home')
  };

  return (
    <button onClick={handleClick} className="home-button">
      <p>Voltar para Home</p>
    </button>
  );
};