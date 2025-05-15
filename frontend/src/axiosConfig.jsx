import axios from 'axios';
import { baseURL } from './config';
const axiosInstance = axios.create({
  baseURL: baseURL, // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
