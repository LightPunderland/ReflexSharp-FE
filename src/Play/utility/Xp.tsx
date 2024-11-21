import styles from './Xp.module.css';
interface XpProps {
    xp: number; 
}


const Xp: React.FC<XpProps> = ({ xp }) => {
    return (
        <div className={styles.xpContainer}>
            XP: {xp}
        </div>
    );
};

export default Xp;
