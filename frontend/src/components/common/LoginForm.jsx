import React from "react";
import Button from "./Button";
import Input from "./Input";

const LoginForm = ({ email, password, onEmailChange, onPasswordChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <Input type="email" placeholder="Email" value={email} onChange={(e) => onEmailChange(e.target.value)} />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
      />
      <Button type="submit" text="Login" />
    </form>
  );
};

export default LoginForm;
