import React, { useState } from "react";
import styles from "./CoursesSection.module.css";
import PythonIcon from "../../../../Images/CoursesIcons/Python.png";
import UnityIcon from "../../../../Images/CoursesIcons/Unity.png";
import ScratchIcon from "../../../../Images/CoursesIcons/Scratch.png";
import RobloxIcon from "../../../../Images/CoursesIcons/Roblox.png";
import MinecarftIcon from "../../../../Images/CoursesIcons/Minecraft.png";

interface Course {
  title: string;
  subtitle: string;
  image: string;
  ageGroup: "8-10" | "11-15";
}

const courses: Course[] = [
  {
    title: "Python",
    subtitle: "От основ программирования до первого ИИ",
    image: PythonIcon,
    ageGroup: "11-15"
  },
  {
    title: "Unity",
    subtitle: "От первых скриптов до игр на витрине",
    image: UnityIcon,
    ageGroup: "11-15"
  },
  {
    title: "Scratch",
    subtitle: "От простых команд до креативных проектов",
    image: ScratchIcon,
    ageGroup: "8-10"
  },
  {
    title: "Minecraft",
    subtitle: "От пиксельных кубов до цифрового творчества",
    image: MinecarftIcon,
    ageGroup: "8-10"
  },
  {
    title: "Roblox Studio",
    subtitle: "От идей до первых заработков",
    image: RobloxIcon,
    ageGroup: "8-10"
  },
];

const CoursesSection: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<"all" | "8-10" | "11-15">("all");

    const filterButtons: { label: string; value: "all" | "8-10" | "11-15" }[] = [
        { label: "Все направления", value: "all" },
        { label: "8-10 лет", value: "8-10" },
        { label: "11-15 лет", value: "11-15" },
    ];

    const filteredCourses =
        activeFilter === "all"
            ? courses
            : courses.filter(course => course.ageGroup === activeFilter);

    return (
        <section id={styles.courses_section}>
        <div className={styles.filters}>
            {
                filterButtons.map((btn) => (
                    <button className={`${styles.filter} ${activeFilter == btn.value ? styles.active : ""}`} onClick={() => setActiveFilter(btn.value)}>{btn.label}</button>
                ))
            }
        </div>

        <div className={styles.cards_container}>
            {filteredCourses.map((course) => (
            <div key={course.title} className={styles.course_card}>
                <div className={styles.course_info_container}>
                    <div className={styles.course_info}>
                        <h3>{course.title}</h3>
                        <p>{course.subtitle}</p>
                    </div>
                    <img src={course.image} alt={course.title} className={styles.course_icon} />
                </div>
                <div className={styles.course_buttons}>
                <button className={styles.btn_secondary}>Подробнее</button>
                <button className={styles.btn_primary}>Записаться</button>
                </div>
            </div>
            ))}
        </div>
        </section>
    );
};

export default CoursesSection;
