import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = (data: { username: string; password: string }) =>
  api.post("/auth/login", data);

export const register = (data: {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: number;
  role?: string;
}) => api.post("/user/register", data);

export const refreshToken = (data: { refreshToken: string }) =>
  api.post("/user/refresh", data);

export default api;
