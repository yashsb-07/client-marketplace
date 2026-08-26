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