import React from "react";
import styles from "./TrialLessonButton.module.css";

interface TrialLessonButtonProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    children?: React.ReactNode;
}

const TrialLessonButton: React.FC<TrialLessonButtonProps> = ({
    className = "",
    style,
    onClick,
    children = "Записаться на пробное занятие"
}) => {
    return (
        <div
            className={`${styles.trial_lesson_button} ${className}`}
            style={style}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default TrialLessonButton;
