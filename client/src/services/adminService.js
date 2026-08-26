import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const TOKEN_KEY = "marketplace_token";

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAdminDashboard = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/dashboard`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data.data;
};

export const getAdminSellers = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/sellers`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data.data;
};

export const getAdminBuyers = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/buyers`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data.data;
};

export const blockAdminUser = async (userId) => {
  const response = await axios.patch(
    `${API_BASE_URL}/admin/users/${userId}/block`,
    {},
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const unblockAdminUser = async (userId) => {
  const response = await axios.patch(
    `${API_BASE_URL}/admin/users/${userId}/unblock`,
    {},
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const getAdminProducts = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/products`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data.data;
};

export const getAdminOrders = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/orders`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data.data;
};