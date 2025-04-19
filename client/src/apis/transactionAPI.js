// src/api/transactionAPI.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const fetchUserTransactions = async (firebaseUID) => {
  const res = await axios.get(`${API_BASE_URL}/transactions/${firebaseUID}`);
  return res.data.transactions;
};
