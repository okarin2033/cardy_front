// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from '../axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null, // {id, username, name}
    token: null,
  });

  // Функция для получения данных пользователя
  const fetchUserData = async (userId, token) => {
    try {
      const response = await axios.get(`/users/${userId}`);
      const user = {
        ...response.data,
        id: userId // Убедимся, что id всегда присутствует
      };
      setAuth({
        isAuthenticated: true,
        user: user,
        token: token
      });
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      logout();
    }
  };

  // Проверка наличия токена при загрузке приложения
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.sub) { // обычно JWT использует 'sub' для идентификатора пользователя
          fetchUserData(decoded.sub, token);
        } else {
          throw new Error('ID пользователя отсутствует в токене');
        }
      } catch (error) {
        console.error('Неверный токен:', error);
        logout();
      }
    }
  }, []);

  // Функция логина
  const login = async (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.sub) {
        Cookies.set('token', token, { expires: 1 });
        await fetchUserData(decoded.sub, token);
      } else {
        throw new Error('ID пользователя отсутствует в токене');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      logout();
    }
  };

  // Функция логаута
  const logout = () => {
    Cookies.remove('token');
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
