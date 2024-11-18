import React from 'react';
import styles from './Replay.module.css';
import { getMotivationalMessage } from './motivation';

interface ReplayProps {
    score: number | null;
    onPlayAgain: () => void;
}

const Replay: React.FC<ReplayProps> = ({ score, onPlayAgain }) => {
    const displayScore = score === null ? "AFK!" : score;
    const motivation = score !== null ? getMotivationalMessage(score) : "";

    return (
        <div className={styles.replayContainer}>
            <p className={styles.motivation}>{motivation}</p>
            <h2 className={styles.replayTitle}>Score: {displayScore}</h2>
            <button className={styles.replayButton} onClick={onPlayAgain}>
                Play Again
            </button>
        </div>
    );
};

export default Replay;