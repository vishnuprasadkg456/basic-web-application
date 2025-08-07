
import axios from "axios";

const API_URL = "/api/profile";

 const updateProfileImage = async (formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await axios.put(`${API_URL}/upload-image`, formData, config);
  return response.data;
};


export { updateProfileImage };
