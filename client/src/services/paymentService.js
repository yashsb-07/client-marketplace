import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const TOKEN_KEY = "marketplace_token";

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const processPayment = async (orderId, outcome) => {
  const response = await axios.post(
    `${API_BASE_URL}/payments/${orderId}`,
    {
      outcome,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getPayment = async (orderId) => {
  const response = await axios.get(
    `${API_BASE_URL}/payments/${orderId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};