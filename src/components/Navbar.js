// src/components/Navbar.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ currentTab, setCurrentTab }) => {
  const { auth } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <ul>
        {auth.isAuthenticated && (
          <li>
            <button
              className={currentTab === 'home' ? 'active' : ''}
              onClick={() => setCurrentTab('home')}
            >
              Главная
            </button>
          </li>
        )}
        <li>
          <button
            className={currentTab === 'profile' ? 'active' : ''}
            onClick={() => setCurrentTab('profile')}
          >
            {auth.isAuthenticated ? 'Профиль' : 'Вход / Регистрация'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
