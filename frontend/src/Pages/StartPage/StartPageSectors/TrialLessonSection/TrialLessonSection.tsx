import React from "react";
import styles from './TrialLessonSection.module.css';

const TrialLessonSection: React.FC = () => {
    return (
        <section id={styles.trial_lesson_section}>
            <div className={styles.trial_lesson_wrapper}>

                <div className={styles.trial_lesson_form}>
                    <h3>Начните обучение с нами!</h3>
                    <form>
                        <input type="text" placeholder="Ваше имя" />
                        <input type="tel" placeholder="Номер телефона" />
                        <input type="email" placeholder="Email" />
                        <select>
                        <option>Выберите тариф</option>
                        <option>Соло-кодер</option>
                        <option>С наставником</option>
                        <option>Максимум</option>
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

                <div className={styles.trial_lesson_text}>
                    <h2>Хотите попробовать?</h2>
                    <p>
                        Выберите тариф и получите <b>бесплатное</b> пробное занятие
                    </p>

                    <svg
                    className={styles.arrow}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 200"
                    >
                    {/* Вертикальная линия вниз */}
                    <path
                        d="M 150 0 
                        V 120 
                        H 20"
                        stroke="white"
                        strokeWidth="3"
                        fill="none"
                    />

                    {/* Точка в начале (посередине p) */}
                    <circle cx="150" cy="0" r="6" fill="white" />

                    {/* Стрелка влево */}
                    <path
                        d="M 20 110 L 5 120 L 20 130"
                        stroke="white"
                        strokeWidth="3"
                        fill="none"
                    />
                    </svg>


                </div>
            </div>
        </section>
    );
};

export default TrialLessonSection;