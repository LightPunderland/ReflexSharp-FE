import { useEffect, useState } from 'react';
import { GetUser } from './GetUser';
import styles from './Profile.module.css';
import { getRankStyle } from './rankHelper';

interface ProfileProps {
    userId: string;
}

interface UserData {
    email: string;
    displayName: string;
    publicRank: number;
    xp: number;
    gold: number;
}

function Profile({ userId }: ProfileProps) {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const data = await GetUser(userId);
                setUserData(data);
                setError(null);
            } catch (err) {
                setError('Failed to load user data');
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error || !userData) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    const rankStyle = getRankStyle(userData.publicRank);

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.title}>Profile Information</h2>
            <div className={styles.statsContainer}>
                
                <div className={styles.statBox}>
                    <span className={styles.label}>Rank</span>
                    <span className={styles.value} style={{ color: rankStyle.color }}>
                        {rankStyle.text}
                    </span>
                </div>

                <div className={styles.statBox}>
                    <span className={styles.label}>Username</span>
                    <span className={styles.value}>{userData.displayName}</span>
                </div>

                <div className={styles.statBox}>
                    <span className={styles.label}>XP</span>
                    <span className={styles.value}>{userData.xp}</span>
                </div>
                <div className={styles.statBox}>
                    <span className={styles.label}>Gold</span>
                    <span className={styles.value}>{userData.gold}</span>
                </div>
            </div>
        </div>
    );
}

export default Profile;