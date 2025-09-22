import React from "react";
import styles from './PriceSection.module.css';

type Plan = {
  id: number;
  title: string;
  price: string;
  features: { text: string; included: boolean }[];
};

const plans: Plan[] = [
  {
    id: 1,
    title: "Соло-кодер",
    price: "1200₽",
    features: [
      { text: "Свободный темп", included: true },
      { text: "Доступ ко всем записям и заданиям курса", included: true },
      { text: "Без поддержки наставника", included: false },
    ],
  },
  {
    id: 2,
    title: "С наставником",
    price: "2400₽",
    features: [
      { text: "Индивидуальная поддержка", included: true },
      { text: "Обратная связь по заданиям", included: true },
      { text: "Все материалы курса", included: true },
    ],
  },
  {
    id: 3,
    title: "Максимум",
    price: "3600₽",
    features: [
      { text: "Персональный наставник", included: true },
      { text: "Онлайн-встречи", included: true },
      { text: "Доступ ко всем курсам школы", included: true },
    ],
  },
];

const PriceSection: React.FC = () => {
    return (
        <section id={styles.price_section}>
            <div className={styles.price_wrapper}>
                <h2>Тарифы</h2>
                <div className={styles.price_container}>
                    {plans.map((plan) => (
                        <div key={plan.id} className={styles.price_card}>
                            <h3 className={styles.title}>Тариф</h3>
                            <h3 className={styles.title}>{plan.title}</h3>
                            <ul className={styles.features}>
                            {plan.features.map((f, i) => (
                                <li
                                key={i}
                                className={f.included ? styles.included : styles.excluded}
                                >
                                {f.included ? "➕" : "➖"} {f.text}
                                </li>
                            ))}
                            </ul>
                            <div className={styles.price}>{plan.price}</div>
                            <button className={styles.button}>Выбрать тариф</button>
                        </div>
                        ))}
                </div>
            </div>
        </section>
    );
};

export default PriceSection;