import axios from "axios";
import { jwtDecode } from "jwt-decode"; // import dependency

const API_URL = "http://localhost:3000";

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  console.log(response.data.accessToken);
  const token = response.data.accessToken;
  const user = jwtDecode(token);

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};

export const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/users`, {
    username,
    email,
    password,
  });
  return response.data;
};
