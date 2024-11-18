interface GoldProps {
    gold: number;
}

const Gold: React.FC<GoldProps> = ({ gold }) => {
    return (
        <div style={{ 
            position: 'absolute', 
            top: '125px', 
            left: '40%', 
            transform: 'translateX(-50%)', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '8px' 
        }}>
            Gold: {gold} {}
        </div>
    );
};

export default Gold;