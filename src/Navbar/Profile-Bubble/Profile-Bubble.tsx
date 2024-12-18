import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_API_URL } from '../../constants/constants';
import styles from './Profile-Bubble.module.css';
import catJpg from './cat.jpg';

const defaultProfileImage = catJpg;

interface ProfileProps {
    ProfileId: string;
}

function ProfileBubble({ ProfileId }: ProfileProps) {
    const [userId, setUserId] = useState('');
    const [userXp, setUserXp] = useState(0);
    const [userCoins, setUserCoins] = useState(0);
    const [username, setUsername] = useState('Guest');
    const [userRank, setUserRank] = useState('Noob');
    const [profileImage, setProfileImage] = useState(defaultProfileImage);

    // comment this out if not working
    const loadProfileInfo = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}api/users/${userId}`);
            const userData = response.data;

            setUserXp(userData.xp || 0);
            setUserCoins(userData.coins || 0);
            setUsername(userData.username || 'Guest');
            setUserRank(userData.rank || 'Noob');


            setProfileImage(userData.profileImage || defaultProfileImage);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        loadProfileInfo();
    }, [userId]);

    return (
        <div className={styles.profileBubble}>
            <div className={styles.infoContainer}>
                <p className={styles.username}>User: {username}</p>
                <p className={styles.rank}>Rank: {userRank}</p>
                <p className={styles.coins}>Coins: {userCoins}</p>
                <p className={styles.xp}>XP: {userXp}</p>
            </div>
            <img className={styles.profileImage} src={profileImage} alt={`${username}'s profile`} />
        </div>
    );
}

export default ProfileBubble;
