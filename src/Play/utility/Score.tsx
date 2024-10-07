// Score.tsx
import React from 'react';

interface ScoreProps {
    score: number;
}

const Score: React.FC<ScoreProps> = ({ score }) => {
    return (
        <div style={{ 
            position: 'absolute', 
            top: '125px', 
            left: '50%', 
            transform: 'translateX(-50%)', // Center horizontally
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '8px', 
            zIndex: 1000 // Ensure it stays on top of other elements
        }}>
            Score: {score !== null ? score : '-'}
        </div>
    );
};

export default Score;
