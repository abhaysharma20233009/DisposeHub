import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// save pickup location
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

// get active locations
export const getActiveLocations = async () => {
  try {
    const res = await api.get("/location/active-locations");

    return res.data.locations || [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch active locations"
    );
  }
};

//  deactivate location
export const deactivateLocation = async (id) => {
  try {
    const res = await api.patch(`/location/${id}/deactivate`, {
      active: false,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to deactivate location"
    );
  }
};
