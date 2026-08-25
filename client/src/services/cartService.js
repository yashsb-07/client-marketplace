import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const TOKEN_KEY = "marketplace_token";

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getCart = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/cart`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const addCartItem = async (
  productId,
  quantity
) => {
  const response = await axios.post(
    `${API_BASE_URL}/cart/items`,
    {
      productId,
      quantity,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const updateCartItem = async (
  productId,
  quantity
) => {
  const response = await axios.patch(
    `${API_BASE_URL}/cart/items/${productId}`,
    {
      quantity,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const removeCartItem = async (
  productId
) => {
  const response = await axios.delete(
    `${API_BASE_URL}/cart/items/${productId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const clearCart = async () => {
  const response = await axios.delete(
    `${API_BASE_URL}/cart`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};