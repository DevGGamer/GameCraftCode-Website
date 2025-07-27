import React, { useState } from "react";
import styles from "./CoursesSection.module.css";
import classNames from "classnames";
import Polygon from '../../../../Images/StartPage/Polygon.png'

type AgeGroup = "all" | "8-10" | "11-15";

interface Course {
    title: string;
    image: string;
    ageGroups: AgeGroup[];
    themeColor: "blue" | "purple";
}

const courses: Course[] = [
    {
        title: "Python",
        image: "/images/python.png",
        ageGroups: ["11-15"],
        themeColor: "blue",
    },
    {
        title: "Unity",
        image: "/images/unity.png",
        ageGroups: ["11-15"],
        themeColor: "purple",
    },
    {
        title: "Minecraft",
        image: "/images/minecraft.png",
        ageGroups: ["8-10", "11-15"],
        themeColor: "purple",
    },
    {
        title: "Roblox",
        image: "/images/roblox.png",
        ageGroups: ["8-10", "11-15"],
        themeColor: "blue",
    },
    {
        title: "Scratch",
        image: "/images/scratch.png",
        ageGroups: ["8-10"],
        themeColor: "blue",
    },
];

const CoursesSection: React.FC = () => {
    const [selectedAge, setSelectedAge] = useState<AgeGroup>("all");

    const filteredCourses =
        selectedAge === "all"
            ? courses
            : courses.filter((course) => course.ageGroups.includes(selectedAge));

    return (
        <section id={styles.courses_section}>
            <div className={styles.courses_section_wrapper}>
                <div className={styles.courses_section_head}>
                    <div className={styles.filterButtons}>
                        <button
                            onClick={() => setSelectedAge("all")}
                            className={classNames(styles.filterButton, {
                                [styles.active]: selectedAge === "all",
                            })}
                        >
                            Все курсы
                        </button>
                        <button
                            onClick={() => setSelectedAge("8-10")}
                            className={classNames(styles.filterButton, {
                                [styles.active]: selectedAge === "8-10",
                            })}
                        >
                            8-10 лет
                        </button>
                        <button
                            onClick={() => setSelectedAge("11-15")}
                            className={classNames(styles.filterButton, {
                                [styles.active]: selectedAge === "11-15",
                            })}
                        >
                            11-15 лет
                        </button>
                    </div>
                    <h2 className={styles.about_section_header}>КУРСЫ</h2>        
                </div>

                <div className={styles.courseGrid}>
                    {filteredCourses.map((course) => (
                        <div key={course.title} className={styles.courseCard}>
                            <div
                                className={classNames(styles.courseTitle, {
                                    [styles.blue]: course.themeColor === "blue",
                                    [styles.purple]: course.themeColor === "purple",
                                })}
                            >
                                {course.title}
                            </div>
                            <img
                                src={course.image}
                                alt={course.title}
                                className={styles.courseImage}
                            />
                            <button className={styles.detailsButton}>
                                Подробнее про курс
                                <div className={classNames(styles.detailsButtonImage, {
                                    [styles.blue_bg]: course.themeColor === "blue",
                                    [styles.purple_bg]: course.themeColor === "purple",
                                })}>
                                    <img src={Polygon} alt="" />
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoursesSection;
