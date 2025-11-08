import React, { useState } from "react";
import styles from "./Header.module.css";
import logoIcon from "../../../../Images/StartPage/Logo.png";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <header>
        <div className={styles.logo_container}>
          <img src={logoIcon} alt="LogoIcon" />
          <h1>PixelVerse</h1>
        </div>

        {/* Десктопная навигация */}
        <div className={styles.nav_container}>
          <ul>
            <li>Обучение</li>
            <li>Курсы</li>
            <li>Тарифы</li>
            <li>
              <div className="button button-with-primary-color">
                Личный кабинет
              </div>
            </li>
          </ul>
        </div>

        {/* Бургер только на мобильных */}
        <div className={styles.burger} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      {/* Мобильное меню */}
      <nav
        className={`${styles.mobile_menu} ${
          isMenuOpen ? styles.open : ""
        }`}
      >
        <ul>
          <li>Обучение</li>
          <li>Курсы</li>
          <li>Тарифы</li>
          <li>
            <div className="button button-with-primary-color">
              Личный кабинет
            </div>
          </li>
        </ul>
      </nav>

      {isMenuOpen && (
        <div className={styles.overlay} onClick={toggleMenu}></div>
      )}
    </>
  );
};

export default Header;
