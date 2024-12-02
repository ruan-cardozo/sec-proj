import axios from 'axios';
import { API_URL } from '../config/config';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true // Incluir cookies nas requisições
});

export default axiosInstance;