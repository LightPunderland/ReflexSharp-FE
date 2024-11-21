import { useEffect } from 'react';
import styles from './RankUpMessage.module.css';

interface RankUpMessageProps {
    rank: string;
    onClose: () => void;
}

const RankUpNotif: React.FC<RankUpMessageProps> = ({ rank, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // 5 second notification time

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.notificationOverlay}>
            <div className={styles.notification}>
                <h2>Congratulations!</h2>
                <p>You've been promoted to {rank}!</p>
            </div>
        </div>
    );
};
export default RankUpNotif;