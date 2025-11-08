import React from "react";
import './StartPage.module.css';
import styles from './StartPage.module.css';
import Header from "./StartPageSectors/Header/Header";
import MainSection from "./StartPageSectors/MainSection/MainSection";
import CoursesSection from "./StartPageSectors/CoursesSection/CoursesSection";
import PriceSection from "./StartPageSectors/PriceSection/PriceSection";

const StartPage: React.FC = () =>
{
    return (
        <div className={styles.start_page_container}>
            <Header />
            <MainSection />
            <CoursesSection />
            <PriceSection />
        </div>
    )
}

export default StartPage;