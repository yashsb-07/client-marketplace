import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const TOKEN_KEY = "marketplace_token";

export const registerBuyer = async ({
  name,
  email,
  password,
}) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/register`,
    {
      name,
      email,
      password,
      role: "BUYER",
    }
  );

  return response.data.data;
};

export const loginUser = async ({
  email,
  password,
}) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/login`,
    {
      email,
      password,
    }
  );

  return response.data.data;
};

export const getCurrentUser = async (token) => {
  const response = await axios.get(
    `${API_BASE_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};