import React from 'react';

interface ScoreProps {
    score: number | null; //Score'as arba null, arba skaicius, pagal boso nurodymus.
}

const Score: React.FC<ScoreProps> = ({ score }) => {
    return (
        <div style={{ 
            position: 'absolute', 
            top: '10px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '8px' 
        }}>
            Score: {score !== null ? score : '-'} {/* Display '-' if score is null */}
        </div>
    );
};

export default Score;
