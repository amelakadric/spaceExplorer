import axios from "axios";

const accessToken = localStorage.getItem("token");

export const httpService = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export const API_URL = "http://localhost:3000";
