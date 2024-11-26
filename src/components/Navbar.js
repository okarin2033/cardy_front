import React from 'react';

const Navbar = ({ currentTab, setCurrentTab }) => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <button
            className={currentTab === 'home' ? 'active' : ''}
            onClick={() => setCurrentTab('home')}
          >
            Главная
          </button>
        </li>
        <li>
          <button
            className={currentTab === 'settings' ? 'active' : ''}
            onClick={() => setCurrentTab('settings')}
          >
            Настройки
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
