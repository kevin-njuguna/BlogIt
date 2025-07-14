import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://blogit-86vo.onrender.com",
  withCredentials: true,
});

export default axiosInstance;
