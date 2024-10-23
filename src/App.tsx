import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Leaderboard from './Leaderboard/Leaderboard';
import Login from './Login/Login';
import Navbar from './Navbar/Navbar';
import Play from './Play/Play';
import Profile from './Profile/Profile';
import { AppRoutes } from './enums/enums';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Not logged in by default, cookies go here later
    const [userId, setUserId] = useState(''); // L: Maybe use cookies here later?
    const [audio] = useState(new Audio('http://localhost:5050/api/Audio/1')); // Brute-force menu music for now, fix this retroactivly

    audio.volume = 0.12;  // PROTECT YOUR EARS


    const handleLogin = (username: string, password: string, userId: string) => {
        if (username && password) {
            setIsLoggedIn(true);
            setUserId(userId)
            audio.play();
        }
    };

    useEffect(() => {
            return () => {
                audio.pause();
            };
        }, [audio]);

    // Login screen, keep it seperate from app for now as to not mess up game score before loading in
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path={AppRoutes.Play} element={<Play userId={userId}/>} />
                <Route path={AppRoutes.Profile} element={<Profile />} />
                <Route path={AppRoutes.Leaderboard} element={<Leaderboard />} />
            </Routes >
        </>
    );
}

export default App;
