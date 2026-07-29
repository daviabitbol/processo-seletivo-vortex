import { LandingBlock } from "../../components/LandingBlock/LandingBlock";
import landingIcon from "../../assets/landingIcon.svg";
import { useNavigate } from "react-router-dom";
import './style.css';

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      <LandingBlock variant="blue">
        <div className="text">
          <h3>
            Já parou pra pensar se existisse um lugar onde você pudesse ter
            acesso aos materiais da faculdade por preços muito mais acessíveis
            ou até de graça?
          </h3>
        </div>
        <div className="svg">
          <img src={landingIcon} alt="Celular" />
        </div>
      </LandingBlock>

      <LandingBlock variant="white">
        <div>
          <button
            className="signup-button"
            type="button"
            onClick={() => navigate("/signup")}
          >
            Fazer cadastro
          </button>
        </div>
        <div className="text">
          <h3>
            Esse lugar existe! Faça seu cadastro e encontre os mais diversos
            materiais estudantis - ou anuncie os seus e
            ajude outros estudantes!
          </h3>
        </div>
      </LandingBlock>

      <LandingBlock variant="blue">
        <div className="text">
          <h3>Já faz parte da comunidade?</h3>
        </div>
        <div>
          <button
            className="login-button"
            type="button"
            onClick={() => navigate("/login")}
          >
            Faça login
          </button>
        </div>
      </LandingBlock>

      <LandingBlock variant="white">
        <div className="text">
          <h3>Ainda com dúvidas?</h3>
        </div>
        <div className="text">
          <p><strong>É pago?</strong> Não, o cadastro e os anúncios são 100% gratuitos.</p>
          <p><strong>Quem pode usar?</strong> Estudantes de qualquer curso da UNIFOR.</p>
        </div>
      </LandingBlock>
    </div>
  );
};