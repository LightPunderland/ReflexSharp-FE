// Replay.tsx
import React from 'react';
import styles from './Replay.module.css';

interface ReplayProps {
    score: number | null;
    onPlayAgain: () => void;
}

const Replay: React.FC<ReplayProps> = ({ score, onPlayAgain }) => {
    return (
        <div className={styles.replayContainer}>
            <h2 className={styles.replayTitle}>Your Score: {score}</h2>
            <button className={styles.replayButton} onClick={onPlayAgain}>
                Play Again
            </button>
        </div>
    );
};

export default Replay;
