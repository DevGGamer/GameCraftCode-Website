import React from "react";
import styles from "./PriceSection.module.css";

type Plan = {
  id: number;
  title: string;
  description: string;
  price: string;
  features: { text: string; included: boolean }[];
  cardStyle: string;
};

const plans: Plan[] = [
  {
    id: 1,
    title: "Started",
    description : "Для самостоятельного изучения",
    price: "1200₽",
    features: [
      { text: "Свободный темп", included: true },
      { text: "Доступ ко всем записям и заданиям курса", included: true },
      { text: "Без поддержки наставника", included: false },
    ],
    cardStyle: styles.first_card
  },
  {
    id: 2,
    title: "Pro",
    description : "Для уверенного роста и новых технологий",
    price: "2400₽",
    features: [
      { text: "Индивидуальная поддержка", included: true },
      { text: "Обратная связь по заданиям", included: true },
      { text: "Все материалы курса", included: true },
    ],
    cardStyle: styles.second_card
  },
  {
    id: 3,
    title: "Galaxy",
    description : "Максимум возможностей и индивидуальные занятия",
    price: "3600₽",
    features: [
      { text: "Персональный наставник", included: true },
      { text: "Онлайн-встречи", included: true },
      { text: "Доступ к материалам курса", included: true },
    ],
    cardStyle: styles.third_card
  },
];

const PriceSection: React.FC = () => {
    return (
        <section id={styles.price_section}>
          <div className={styles.header_container}>
            <h1>Выбери свой путь в PixelVerse</h1>
            <p>Тарифы обучения - для каждого уровня знания</p>
          </div>
              <div className={styles.price_container}>
                    {plans.map((plan) => (
                        <div key={plan.id} className={`${styles.price_card} ${plan.cardStyle} ${plan.id == 2 ? styles.active_card : ""}`}>
                          <div className={styles.card_info}>
                            <h3 className={styles.title}>{plan.title}</h3>
                            <p>{plan.description}</p>
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
                          </div>
                            <div className={styles.price}>{plan.price}</div>
                            <div id={styles.btn_card} className="button button-with-accent-color">Выбрать тариф</div>
                        </div>
                        ))}
                </div>
        </section>
    );
};

export default PriceSection;
