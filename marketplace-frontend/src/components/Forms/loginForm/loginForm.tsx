import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginForm.css";
import { api } from "../../../services/api";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const { token, expiresIn } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expiresIn);
      localStorage.setItem("username", username)

      navigate("/home");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError("Senha inválida");
      } else {
        setError("Erro ao conectar com o servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>Marketplace circular</h1>
      <h2>Login</h2>

      {error && (
        <p
          style={{
            color: "#ef4444",
            fontSize: "14px",
            textAlign: "center",
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        required
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="redirect-to-login">
        Já tem uma conta? <span onClick={() => navigate("/signup")}>Cadastre-se</span>
      </p>
    </form>
  );
};

export default LoginForm;