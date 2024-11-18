interface XpProps {
    xp: number; 
}


const Xp: React.FC<XpProps> = ({ xp }) => {
    return (
        <div style={{ 
            position: 'absolute', 
            top: '125px', 
            left: '59.65%', 
            transform: 'translateX(-50%)', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '8px' 
        }}>
            Xp: {xp} {}
        </div>
    );
};

export default Xp;
