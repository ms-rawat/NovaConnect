import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Adjust the base URL as needed
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      console.log(token)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
