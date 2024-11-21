import { useEffect, useState } from "react";
import { GetLeaderboard, LeaderboardEntry } from "./GetLeaderboard";
import styles from './Leaderboard.module.css';

const DEFAULT_ENTRY_COUNT = 10;
const REFRESH_INTERVAL_MINUTES = 5;

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeader = async () => {
            try {
                setLoading(true);
                const data = await GetLeaderboard(DEFAULT_ENTRY_COUNT);
                setLeaderboard(data);
                setError(null);
            } catch (e) {
                setError('Failed to load leaderboard');
            } finally {
                setLoading(false);
            }
        };

        fetchLeader();
        const interval = setInterval(fetchLeader, REFRESH_INTERVAL_MINUTES * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Leaderboard</h1>
            <div className={styles.content}>
                <ol className={styles.leaderboard}>
                    {leaderboard.map((entry, index) => (
                        <li className={styles.entry} key={entry.id}>
                            <div className={styles.rank}>{index + 1}</div>
                            <div className={styles.playerInfo}>
                                <span className={styles.name}>{entry.user}</span>
                                <span className={styles.score}>{entry.score}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default Leaderboard;
