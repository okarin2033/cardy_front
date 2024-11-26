// src/axiosConfig.js
import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'http://localhost:8080/v1', // Убедитесь, что это соответствует вашему бэкенду
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Если вы отправляете куки
});

// Добавляем перехватчик для установки токена
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
