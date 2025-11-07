import React from "react";
import styles from './MainSection.module.css';

const MainSection: React.FC = () => {
    return (
        <section id={styles.main_section}>
            <div className={styles.central_card_container}>
                <div className={styles.central_card}>
                    <h1>Создавай свои миры с PixelVerse</h1>
                    <p>Обучение программированию для детей и подростков</p>
                </div>
                <div id={styles.button} className="button button-with-accent-color">Начать обучение</div>
            </div>
        </section>
    );
};

export default MainSection;
