import React from "react";
import './StartPage.module.css';
import styles from './StartPage.module.css';
import Header from "./StartPageSectors/Header/Header";
import MainSection from "./StartPageSectors/MainSection/MainSection";
import AboutSection from "./StartPageSectors/AboutSection/AboutSection";
import CoursesSection from "./StartPageSectors/CoursesSection/CoursesSection";
import PriceSection from "./StartPageSectors/PriceSection/PriceSection";
import TrialLessonSection from "./StartPageSectors/TrialLessonSection/TrialLessonSection";

const StartPage: React.FC = () =>
{
    return (
        <div className={styles.start_page_container}>
            <Header />
            <MainSection />
            <AboutSection />
            <CoursesSection />
            <PriceSection />
            <TrialLessonSection />
        </div>
    )
}

export default StartPage;