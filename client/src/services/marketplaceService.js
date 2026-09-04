import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getMarketplaceProducts = async ({
  page = 1,
  limit = 12,
  search = "",
  categoryId = "",
  minPrice = "",
  maxPrice = "",
  available = "",
  sort = "",
} = {}) => {
  const params = {
    page,
    limit,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (categoryId) {
    params.categoryId = categoryId;
  }

  if (minPrice !== "") {
    params.minPrice = minPrice;
  }

  if (maxPrice !== "") {
    params.maxPrice = maxPrice;
  }

  if (available !== "") {
    params.available = available;
  }

  if (sort) {
    params.sort = sort;
  }

  const response = await axios.get(
    `${API_BASE_URL}/marketplace/products`,
    {
      params,
    }
  );

  return response.data.data;
};

export const getMarketplaceProductById = async (productId) => {
  const response = await axios.get(
    `${API_BASE_URL}/marketplace/products/${productId}`
  );

  return response.data.data;
};

export const getMarketplaceCategories = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/marketplace/categories`
  );

  return response.data.data;
};