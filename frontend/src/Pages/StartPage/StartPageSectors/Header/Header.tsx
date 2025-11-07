import React from "react";
import { Link } from "react-router-dom";
import styles from './Header.module.css';
import logoIcon from '../../../../Images/StartPage/Logo.png'

const Header: React.FC = () => {
    return (
        <header>
            <div className={styles.logo_container}>
                <img src={logoIcon} alt="LogoIcon" />
                <h1>PixelVerse</h1>
            </div>
            <div className={styles.nav_container}>
                <nav>
                    <ul>
                        <li>Обучение</li>
                        <li>Курсы</li>
                        <li>Тарифы</li>
                        <li><div className="button button-with-primary-color">Личный кабинет</div></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;