import axios from 'axios';

interface ScoreData {
    userId: string;
    score: number;
}

export const PostScore = async (userId: string, score: number): Promise<void> => {
    const scoreData: ScoreData = {
        userId,
        score,
    };

    console.log('I am alive');
    try {
        await axios.post('http://localhost:5050/api/leaderboard/create', scoreData);
        console.log('Score posted successfully!');
    } catch (error) {
        console.error('Error wen making post', error);
    }
};