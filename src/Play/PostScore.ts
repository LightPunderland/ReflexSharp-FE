import axios from 'axios';

interface ScoreData {
    userId: string;
    score: number;
}

interface RankUpResponse {
    hasRankedUp: boolean;
    newRank: string;
}

export const PostScore = async (userId: string, score: number): Promise<void> => {
    const scoreData: ScoreData = {
        userId,
        score,
    };

    console.log('I am alive');
    try {
        await axios.post('api/leaderboard/create', scoreData);
        console.log('Score posted successfully!');
    } catch (error) {
        console.error('Error wen making post', error);
    }
};


export const rewardGoldXp = async (userId: string, gold: number, xp: number): Promise<void> => {
    const url = `api/users/${userId}/rewardGoldXp?addGold=${gold}&addXp=${xp}`;

    console.log('Sending reward data...');
    try {
        await axios.post(url);
        console.log('Reward data sent successfully!');
    } catch (error) {
        console.error('Error when making post request', error);
    }
};


export const checkRankUp = async (userId: string): Promise<RankUpResponse | null> => {
    try {
        const response = await axios.post(`/api/users/${userId}/check-rankup`);
        console.log('Rank check completed successfully');
        return response.data;
    } catch (error) {
        console.error('Error checking rank:', error);
        return null;
    }
};

