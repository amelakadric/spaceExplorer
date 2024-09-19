import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { login } from "../services/authService";
import "../styles/auth.css";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // State for messages
  const [messageType, setMessageType] = useState(""); // State for message type (success or error)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // localStorage.setItem("user", email);
      setMessage("Login successful!"); // Set success message
      setMessageType("success"); // Set the message type to success
      onLogin(); // Notify parent component (App) of successful login
      navigate("/home"); // Redirect to home
    } catch (error) {
      console.log(error);
      setMessage("Invalid email or password"); // Set error message
      setMessageType("error"); // Set the message type to error
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      {/* Conditionally render message */}
      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <form onSubmit={handleLogin}>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" text="Login" />
      </form>
    </div>
  );
};

export default LoginPage;
