import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const savePickupLocation = async (location) => {
  try {
    const response = await api.post("/location/save", location);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to save pickup location"
    );
  }
};
