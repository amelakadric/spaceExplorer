import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/common/LoginForm";
import { login } from "../services/authService";
import "../styles/auth.css";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      setMessage("Login successful!");
      setMessageType("success");
      onLogin();
      if (user.role === "RegisteredUser") {
        navigate("/home");
      } else {
        navigate("/admin/posts");
      }
    } catch (error) {
      console.log(error);
      setMessage("Invalid email or password");
      setMessageType("error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <LoginForm
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    </div>
  );
};

export default LoginPage;
