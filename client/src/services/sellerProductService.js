import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const TOKEN_KEY = "marketplace_token";

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getSellerProducts = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/products/mine`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const getSellerProductById = async (productId) => {
  const response = await axios.get(
    `${API_BASE_URL}/products/mine/${productId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const createSellerProduct = async (productData) => {
  const response = await axios.post(
    `${API_BASE_URL}/products/`,
    productData,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const updateSellerProduct = async (
  productId,
  productData
) => {
  const response = await axios.put(
    `${API_BASE_URL}/products/${productId}`,
    productData,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const updateSellerProductVisibility = async (
  productId,
  isVisible
) => {
  const response = await axios.patch(
    `${API_BASE_URL}/products/${productId}/visibility`,
    {
      isVisible,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const deactivateSellerProduct = async (productId) => {
  const response = await axios.patch(
    `${API_BASE_URL}/products/${productId}/deactivate`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const activateSellerProduct = async (productId) => {
  const response = await axios.patch(
    `${API_BASE_URL}/products/${productId}/activate`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};