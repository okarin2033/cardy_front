import React from 'react';

const Navbar = ({ currentTab, setCurrentTab }) => {
  return (
    <nav className="navbar">
      <ul>
        <li className={currentTab === 'home' ? 'active' : ''} onClick={() => setCurrentTab('home')}>Главная</li>
        <li className={currentTab === 'settings' ? 'active' : ''} onClick={() => setCurrentTab('settings')}>Настройки</li>
        <li className={currentTab === 'lastCollection' ? 'active' : ''} onClick={() => setCurrentTab('lastCollection')}>Последняя коллекция</li>
      </ul>
    </nav>
  );
};

export default Navbar;
