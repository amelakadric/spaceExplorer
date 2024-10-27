import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { register } from "../services/authService";
import "../styles/auth.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords don't match.");
      setMessageType("error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      console.log([...formData.entries()]); // Debugging log to check formData content

      const response = await register(formData);
      console.log(response);
      setMessage("Registration successful! You'll be redirected to login shortly.");
      setMessageType("success");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
      setMessageType("error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

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

        <div className="file-input-container">
          <label htmlFor="profilePicture" className="file-input-label">
            Profile Picture (optional):
          </label>
          <Input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>

        <Button text="Register" type="submit" />
      </form>
    </div>
  );
};

export default RegisterPage;
