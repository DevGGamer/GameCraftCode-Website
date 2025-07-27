import React from "react";
import styles from "./PriceSection.module.css";
import classNames from "classnames";

const tariffs = [
    {
        title: "Соло-кодер",
        features: [
            { text: "Свободный темп", type: "positive" },
            { text: "Доступ ко всем записям и заданиям курса", type: "positive" },
            { text: "Без поддержки наставника", type: "negative" },
        ],
        price: "1200₽",
    },
    {
        title: "С ментором",
        features: [],
        price: "1200₽",
    },
    {
        title: "Code Together",
        features: [],
        price: "1200₽",
    },
];

const PriceSection: React.FC = () => {
    return (
        <section id={styles.price_section}>
            <h2 className={styles.title}>Тарифы</h2>
            <div className={styles.scrollWrapper}>
                <div className={styles.cardContainer}>
                    {tariffs.map((tariff, index) => (
                        <div className={styles.card} key={index}>
                            <div className={styles.tariffLabel}>Тариф</div>
                            <div className={styles.tariffTitle}>{tariff.title}</div>
                            <ul className={styles.featureList}>
                                {tariff.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className={classNames(styles.featureItem, {
                                            [styles.positive]: feature.type === "positive",
                                            [styles.negative]: feature.type === "negative",
                                        })}
                                    >
                                        {feature.type === "positive" ? "➕" : "🚫"} {feature.text}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.price}>{tariff.price}</div>
                            <button className={styles.button}>Выбрать тариф</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PriceSection;
