import styles from './Gold.module.css';
interface GoldProps {
    gold: number;
}

const Gold: React.FC<GoldProps> = ({ gold }) => {
    return (
        <div className={styles.goldContainer}>
            Gold: {gold}
        </div>
    );
};

export default Gold;
