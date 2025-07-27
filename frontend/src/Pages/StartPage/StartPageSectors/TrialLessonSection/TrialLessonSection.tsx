import React from "react";
import styles from './TrialLessonSection.module.css';
import ArrowImage from '../../../../Images/StartPage/Arrow.png'

const TrialLessonSection: React.FC = () => {
    return (
        <section id={styles.trial_lesson_section}>
            <div className={styles.container}>
                <div className={styles.formBox}>
                    <h3 className={styles.formTitle}>Начните обучение с нами!</h3>
                    <form className={styles.form}>
                        <input type="text" placeholder="Ваше имя" />
                        <input type="tel" placeholder="Номер телефона" />
                        <input type="email" placeholder="Email" />
                        <select>
                            <option>Выберите тариф</option>
                            <option>Соло-кодер</option>
                            <option>С ментором</option>
                            <option>Code Together</option>
                        </select>
                        <select>
                            <option>Выберите курс</option>
                            <option>Python</option>
                            <option>Unity</option>
                            <option>Scratch</option>
                            <option>Roblox</option>
                            <option>Minecraft</option>
                        </select>
                        <button type="submit">Записаться</button>
                    </form>
                </div>

                <div className={styles.promoBox}>
                    <h3 className={styles.promoTitle}>Хотите попробовать?</h3>
                    <p className={styles.promoText}>
                        Выберите тариф и получите <strong>бесплатное</strong> пробное занятие
                    </p>
                    <img src={ArrowImage} alt="Arrow" className={styles.arrow} />
                </div>
            </div>
        </section>
    );
};

export default TrialLessonSection;
