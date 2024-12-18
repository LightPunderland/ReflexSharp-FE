import axios from 'axios';

interface UserData {
    email: string;
    displayName: string;
    publicRank: number;
    xp: number;
    gold: number;
    ownedSkins: string[];
    equippedSkin: string;
}

export async function GetUser(userId: string): Promise<UserData> {
    try {
        const response = await axios.get(`api/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}
