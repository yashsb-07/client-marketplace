import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const getMarketplaceProducts = async ({
  page = 1,
  limit = 12,
} = {}) => {
  const response = await axios.get(
    `${API_BASE_URL}/marketplace/products`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data.data;
};