// src/components/Profile.js
import React, { useState, useContext } from 'react';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { auth, login, logout } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true); // Переключение между входом и регистрацией
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setForm({
      username: '',
      password: '',
      name: '',
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/auth/register', {
        username: form.username,
        password: form.password,
        name: form.name,
      });

      if (response.data.token) {
        await login(response.data.token);
      } else {
        setError('Регистрация прошла успешно, но токен не получен');
      }
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/auth/login', {
        username: form.username,
        password: form.password,
      });

      if (response.data.token) {
        await login(response.data.token);
      } else {
        setError('Токен не получен');
      }
    } catch (err) {
      console.error('Ошибка входа:', err);
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (auth.isAuthenticated) {
    return (
      <div className="profile">
        <h2>Профиль</h2>
        <p>Имя: {auth.user.name || auth.user.username}</p>
        <p>ID: {auth.user.id}</p>
        <button onClick={handleLogout}>Выйти</button>
      </div>
    );
  }

  return (
    <div className="profile">
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        <div className="form-group">
          <label htmlFor="username">Логин</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
        )}
        <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>
      <button className="toggle-button" onClick={toggleForm}>
        {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Есть аккаунт? Войти'}
      </button>
    </div>
  );
};

export default Profile;
