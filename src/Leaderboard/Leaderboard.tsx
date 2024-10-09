import { useEffect, useState } from "react";
import axios from "axios";

const LeaderboardLink = 'http://localhost:5050/api/leaderboard';

function Leaderboard(){

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