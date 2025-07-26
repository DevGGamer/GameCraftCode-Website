import React from "react";
import styles from './MainSection.module.css';
import TrialLessonButton from "../../../../Components/TrialLessonButton/TrialLessonButton";
import VRCharacterImage from '../../../../Images/StartPage/vrcharacter.png'

const MainSection: React.FC = () => {
    return (
        <section className={styles.main_section}>
            <div className={styles.content_wrapper}>
                <div className={styles.left_block}>
                    <h1>
                        <span>ИЗУЧИ КОД,</span><br />
                        <span>КАК ЕСЛИ БЫ</span><br />
                        <span>ТЫ БЫЛ В ИГРЕ!</span>
                    </h1>
                    <p>Стань создателем цифровых миров, играя и обучаясь у нас</p>
                    <TrialLessonButton className={styles.trial_lesson_button}/>

                    <div className={styles.right_block}>
                        <img
                            src={VRCharacterImage}
                            alt="Мальчик в VR"
                            className={styles.hero_image}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MainSection;
