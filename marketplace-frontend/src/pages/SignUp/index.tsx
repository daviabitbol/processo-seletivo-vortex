import { SignUpForm } from "../../components/Forms/signUpForm/signUpForm";
import Waves from "../../components/waves/waves";
import "./style.css";

export const SignUp = () => {
  return (
    <div className="page-wrapper">
      <div className="container">
        <SignUpForm />
      </div>
      <Waves />
    </div>
  );
}