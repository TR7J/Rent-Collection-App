import axios from "axios";

const instance = axios.create({
  baseURL: "https://rent-collection-app-api.onrender.com", //  "http://localhost:8000"
});
// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo")!)
      : null;
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
