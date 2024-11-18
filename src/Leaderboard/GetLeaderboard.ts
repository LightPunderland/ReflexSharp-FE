import axios from 'axios';

export interface LeaderboardEntry {
    user: string | null;
    score: number;
    id: string;
    userId: string;
}

export async function GetLeaderboard(count: number = 5): Promise<LeaderboardEntry[]> {
    try {
        const response = await axios.get(`/host/leaderboard?count=${count}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
}