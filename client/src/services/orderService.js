import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const TOKEN_KEY = "marketplace_token";

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const createOrder = async () => {
  const response = await axios.post(
    `${API_BASE_URL}/orders`,
    {
      confirm: true,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};