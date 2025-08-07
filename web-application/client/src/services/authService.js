import axios from 'axios';

const API_BASE = '/api/auth';

const login = async (email, password, role) => {
  const endPoint = role === 'admin' ? `${API_BASE}/admin/login` : `${API_BASE}/user/login`;

  console.log("Sending POST to:", endPoint);
  console.log("Payload:", { email, password });

  const response = await axios.post(endPoint, { email, password });

  console.log("Response received:", response);

  return response.data;
};

export default {
  login,
};
