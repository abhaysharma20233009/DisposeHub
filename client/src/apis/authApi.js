import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/* ================= SIGNUP ================= */
export const signupUser = async (userData) => {
  const res = await api.post("/users/signup", userData);
  return res.data;
};

/* ================= LOGIN ================= */
export const loginUser = async (credentials) => {
  const res = await api.post("/users/login", credentials);
  return res.data;
};

/* ================= LOGOUT ================= */
export const logoutUser = async () => {
  const res = await api.post("/users/logout");
  return res.data;
};