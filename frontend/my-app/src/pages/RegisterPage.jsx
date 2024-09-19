import React, { useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { register } from "../services/authService";
import "../styles/auth.css"; // Ensure you have styles for success and error messages

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); // Message to display
  const [messageType, setMessageType] = useState(""); // 'success' or 'error' for styling

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      setMessageType("error");
      return;
    }

    try {
      const response = await register(username, email, password);
      setMessage("Registration successful! You can now LogIn");
      setMessageType("success");
      console.log(response);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
      setMessageType("error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      {/* Display message if it exists */}
      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button text="Register" type="submit" />
      </form>
    </div>
  );
};

export default RegisterPage;
