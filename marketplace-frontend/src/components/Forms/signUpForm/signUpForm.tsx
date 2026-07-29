import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signUpForm.css";
import { api } from "../../../services/api";

export const SignUpForm= () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não são iguais");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users", {
        username,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      if (err.response?.data?.message) {
        const apiMessage = err.response.data.message;
        setError(Array.isArray(apiMessage) ? apiMessage[0] : apiMessage);
      } else {
        setError("Erro ao conectar com o servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h1>Marketplace circular</h1>
      <h2>Cadastro de usuário</h2>

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
        maxLength={20}
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

      <input
        type="password"
        placeholder="Confirmar senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>

      <p className="redirect-to-login">
        Já tem uma conta? <span onClick={() => navigate("/login")}>Faça login</span>
      </p>
    </form>
  );
};