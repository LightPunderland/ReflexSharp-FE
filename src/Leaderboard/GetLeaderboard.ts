import axios from 'axios';

export interface LeaderboardEntry {
    user: string | null;
    score: number;
    id: string;
    userId: string;
}

// Use this workaround till leaderboard username gets fixed :)
export async function fetchUsername(userId: string): Promise<string | null> {
    try {
        const response = await axios.get(`api/users/${userId}`);
        return response.data.displayName || null;
    } catch (error) {
        console.error(`Error fetching username for userId: ${userId}`, error);
        return null;
    }
}

export async function GetLeaderboard(count: number = 10): Promise<LeaderboardEntry[]> {
    try {
        const response = await axios.get(`api/leaderboard?count=${count}`);
        const leaderboard: LeaderboardEntry[] = response.data;

        const leaderboardWithUsernames = await Promise.all(
            leaderboard.map(async (entry) => {
                if (!entry.user) {
                    const username = await fetchUsername(entry.userId);
                    return { ...entry, user: username };
                }
                return entry;
            })
        );

        return leaderboardWithUsernames;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
}
