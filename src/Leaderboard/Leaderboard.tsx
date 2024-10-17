import { useEffect, useState } from "react";
import axios from "axios";
import { seedRandomUsername } from "./RandomName";
import styles from './Leaderboard.module.css';

const DEFAULT_ENTRY_COUNT = 5;
const REFRESH_INTERVAL_MINUTES = 5;

function Leaderboard(){

    const [count, setCount] = useState(DEFAULT_ENTRY_COUNT);

    const LeaderboardLink = `/host/leaderboard?count=${count}`;
    interface LeaderboardEntry {
        user: string | null;
        score: number;
        id: string;
        userId: string;
    }

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {

        const fetchLeader = async () =>{
            try {
                const response = await axios.get(LeaderboardLink);
                setLeaderboard(response.data);
            } catch(e){
                console.error("Error ",  e);
            }
        };

        fetchLeader();

        const interval = setInterval(fetchLeader, REFRESH_INTERVAL_MINUTES * 60 * 1000);
        return () => clearInterval(interval);
    }, []);
    

    return(<div className={styles.container}>
            <p className={styles.title}>Leaderboard</p>

            <ol className={styles.leaderboard}>
                {leaderboard.map((entry, index) => (
                    <li className={styles.entry} key={index}>
                        {entry.user === null ? seedRandomUsername(entry.userId) : entry.user}: {entry.score}
                    </li>
                ))}
            </ol>
            </div>)
}

export default Leaderboard;