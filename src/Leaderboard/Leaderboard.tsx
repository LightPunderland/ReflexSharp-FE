import { useEffect, useState } from "react";
import axios from "axios";

const DEFAULT_ENTRY_COUNT = 5;

function Leaderboard(){

    const [count, setCount] = useState(DEFAULT_ENTRY_COUNT);

    const LeaderboardLink = `/host/leaderboard?count=${count}`;
    interface LeaderboardEntry {
        username: string;
        score: number;
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
    }, []);
    


    return(<div>
            <p>Leaderboard</p>

            <ul>
                {leaderboard.map((entry, index) => (
                    <li key={index}>
                        {entry.username}: {entry.score}
                    </li>
                ))}
            </ul>
            </div>)
}

export default Leaderboard;