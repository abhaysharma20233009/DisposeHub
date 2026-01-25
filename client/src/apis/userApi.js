import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export const getMe = async () => {
    try {
        const firebaseUID = localStorage.getItem("firebaseUID"); 
    
        if (!firebaseUID) {
          return null;
        }
    
        const response = await axios.get(
          `${API_BASE_URL}/users/${firebaseUID.trim()}`
        );
         //console.log(response.user+response);
        return response.data.user;
      } catch (error) {
        // console.error("Error fetching user by UID:", error);
        if (error.response?.status !== 404) {
          console.error("Failed to fetch user:", error);
        }
        return null;
      }
};


export const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    const firebaseUID = localStorage.getItem("firebaseUID"); 
    const response = await fetch(`${API_BASE_URL}/users/upload-profile-photo/${firebaseUID.trim()}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });
  
    if (!response.ok) {
      throw new Error("Upload failed!");
    }
  
    return await response.json();
  };
  
  export const updateUserProfile = async (updatedData) => {
    const firebaseUID = localStorage.getItem("firebaseUID");
    const response = await fetch(`${API_BASE_URL}/users/update-profile/${firebaseUID.trim()}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
      credentials: "include",
    });
  
    if (!response.ok) {
      throw new Error("Failed to update profile.");
    }
  
    return await response.json();
  };
  