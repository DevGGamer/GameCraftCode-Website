import React from "react";
import styles from './AboutSection.module.css';
import RocketIcon from '../../../../Images/StartPage/Rocket.png';
import AboutIcon1 from '../../../../Images/StartPage/AboutIcon1.png';
import AboutIcon2 from '../../../../Images/StartPage/AboutIcon2.png';
import ReasonIcon1 from '../../../../Images/StartPage/ReasonIcon1.png';
import ReasonIcon2 from '../../../../Images/StartPage/ReasonIcon2.png';
import ReasonIcon3 from '../../../../Images/StartPage/ReasonIcon3.png';
import ReasonIcon4 from '../../../../Images/StartPage/ReasonIcon4.png';
import ReasonIcon5 from '../../../../Images/StartPage/ReasonIcon5.png';
import ReasonIcon6 from '../../../../Images/StartPage/ReasonIcon6.png';
import AboutEducationImage from '../../../../Images/StartPage/AboutEducation.png';

const AboutSection: React.FC = () => {
    return (
        <section id={styles.about_section}>
            <div className={styles.about_wrapper}>
                <div className={styles.card}>
                    <h2>О НАС</h2>
                    <p>
                        <strong className={styles.highlight}>GameCraftCode</strong> — это не просто школа.
                        Это портал в мир, где ты сам создаёшь свои проекты, учишься кодить с нуля и прокачиваешь мозг как настоящий GameDev инженер.
                    </p>
                    <br />
                    <p>
                        <span className={styles.icon}><img src={AboutIcon1} alt="About Icon 1" /></span>
                        Учись в игровом формате, выбирай свой стиль обучения и создавай проекты, которыми можно гордиться.<br />
                        У нас нет скучных лекций — только практика, менторы и крутое комьюнити.
                    </p>
                    <br />
                    <p>
                        <span className={styles.icon}><img src={AboutIcon2} alt="About Icon 2" /></span>
                        Создавай. Играй. Программируй.<br />
                        <strong className={styles.highlight}>GameCraftCode</strong> — здесь рождаются разработчики будущего.
                    </p>
                    <img src={RocketIcon} alt="Ракета" className={styles.rocket} />
                </div>

                <div className={styles.about_reasons}>
                    <h2 className={styles.about_section_header}>ПОЧЕМУ ВЫБИРАЮТ НАС?</h2>
                    <div className={styles.reasons}>
                        <div className={styles.reason_section}>
                            <div className={styles.reason_card}>
                                <img src={ReasonIcon1} alt="Игровой формат" />
                                <p>Обучение <br /> в игровом формате</p>
                            </div>
                            <div className={styles.reason_card}>
                                <img src={ReasonIcon2} alt="Удобная онлайн платформа" />
                                <p>Удобная <br /> онлайн платформа</p>
                            </div>
                            <div className={styles.reason_card}>
                                <img src={ReasonIcon3} alt="Гибкое расписание" />
                                <p>Гибкое <br /> расписание</p>
                            </div>
                        </div>
                        <div className={styles.reason_section}>
                            <div className={styles.reason_card}>
                                <img src={ReasonIcon4} alt="Профессиональные наставники" />
                                <p>Профессиональные <br /> наставники</p>
                            </div>
                            <div className={styles.reason_card}>
                                <img src={ReasonIcon5} alt="Выбор формата обучения" />
                                <p>Выбор <br /> формата обучения</p>
                            </div>
                            <div className={styles.reason_card}>
                                <img src={ReasonIcon6} alt="Взаимодействие с сообществом учеников" />
                                <p>Взаимодействие <br /> с сообществом учеников</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.about_education}>
                    <h2 className={styles.about_section_header}>КАК ПРОХОДИТ ОБУЧЕНИЕ</h2>
                    <img src={AboutEducationImage} alt="About Education Image" />
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
