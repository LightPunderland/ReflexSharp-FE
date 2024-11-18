import React from 'react';
import styles from './Score.module.css'
interface ScoreProps {
    score: number | null; //Score'as arba null, arba skaicius, pagal boso nurodymus.
}

const Score: React.FC<ScoreProps> = ({ score }) => {
    return (
        <div className={styles.scoreContainer}>
            Score: {score !== null ? score : "-"}
            <div className={styles.plusOneContainer} key={score}>
                <div className={styles.plusOne}>+1</div>
            </div>
        </div>
    );
};

export default Score;
