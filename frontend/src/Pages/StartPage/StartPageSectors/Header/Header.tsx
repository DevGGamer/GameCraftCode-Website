import React from "react";
import { Link } from "react-router-dom";
import styles from './Header.module.css';
import TrialLessonButton from "../../../../Components/TrialLessonButton/TrialLessonButton";

const Header: React.FC = () => {
    return (
        <header>
            <div className={styles.header_container}>
                <div className={styles.school_logo}>
                    <h1>GameCraftCode</h1>
                </div>
                <nav>
                    <ul className={styles.nav_list}>
                        <li><a href="#about_section" className={styles.selected}>О нас</a></li>
                        <li><a href="">Курсы</a></li>
                        <li><a href="">Тарифы</a></li>
                        <li><Link to="/login">Личный кабинет</Link></li>
                        <li>
                            <TrialLessonButton className={styles.trial_lesson_button}/>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;