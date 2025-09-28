import React, { useState } from "react";
import styles from './CoursesSection.module.css';
import Python from '../../../../Images/StartPage/Python.png';
import Unity from '../../../../Images/StartPage/Unity.png';
import Minecraft from '../../../../Images/StartPage/Minecraft.png';
import Roblox from '../../../../Images/StartPage/Roblox.png';
import Scratch from '../../../../Images/StartPage/Scratch.png';

type Course = {
  id: number;
  title: string;
  icon: string;
  ageGroup: "8-10" | "11-15";
};

const courses: Course[] = [
  { id: 1, title: "Python", icon: Python, "ageGroup": "11-15" },
  { id: 2, title: "Unity", icon: Unity, "ageGroup": "11-15" },
  { id: 3, title: "Minecraft", icon: Minecraft, "ageGroup": "8-10" },
  { id: 4, title: "Roblox", icon: Roblox, "ageGroup": "8-10" },
  { id: 5, title: "Scratch", icon: Scratch, "ageGroup": "8-10" },
];

const CoursesSection: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<"all" | "8-10" | "11-15">("all");

    const filterButtons: { label: string; value: "all" | "8-10" | "11-15" }[] = [
        { label: "Все курсы", value: "all" },
        { label: "8-10 лет", value: "8-10" },
        { label: "11-15 лет", value: "11-15" },
    ];

    const filteredCourses =
        activeFilter === "all"
            ? courses
            : courses.filter(course => course.ageGroup === activeFilter);

    return (
        <section id={styles.courses_section}>
            <div className={styles.courses_wrapper}>
                <div className={styles.courses_section_header}>
                    <h2>КУРСЫ</h2>
                    <div className={styles.filterButtons}>
                        {filterButtons.map((btn) => (
                        <button
                            key={btn.value}
                            className={activeFilter === btn.value ? styles.active : ""}
                            onClick={() => setActiveFilter(btn.value)}
                        >
                            {btn.label}
                        </button>
                        ))}
                    </div>
                </div>
                <div className={styles.courses_container}>
                    {filteredCourses.map((course) => (
                        <div key={course.id} className={styles.course_card}>

                            <div className={styles.course_info}>
                                <h3>{course.title}</h3>
                                <button>Подробнее про курс </button>
                            </div>

                            <div className={styles.course_img_wrapper}>
                                <img src={course.icon} alt={course.title} />
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoursesSection;
