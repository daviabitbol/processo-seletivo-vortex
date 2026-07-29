import { LoginForm } from "../../components/Forms/loginForm/loginForm";
import Waves from "../../components/waves/waves";
import "./style.css";

export const Login = () => {
  return (
    <div className="page-wrapper">
      <div className="container">
        <LoginForm />
      </div>
      <Waves />
    </div>
  );
}