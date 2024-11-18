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
    const [audio] = useState(() => {
        const audio = new Audio('/host/Audio/34');
        audio.volume = 0.11;
        return audio;
    });
    audio.volume = 0.11;  // PROTECT YOUR EARS

    const handleLogin = (username: string, password: string, userId: string) => {
        if (username && password) {
            setIsLoggedIn(true);
            setUserId(userId)
            audio.play();
        }
    };

   useEffect(() => {
        audio.addEventListener('error', (e) => {
            console.warn('Audio failed to load:', e);
        });

        return () => {
            audio.pause();
            audio.removeEventListener('error', (e) => {
                console.warn('Audio failed to load:', e);
            });
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
                <Route path={AppRoutes.Leaderboard} element={<Leaderboard />} />
                <Route path={AppRoutes.Profile} element={<Profile userId={userId}/>} />
            </Routes >
        </>
    );
}

export default App;
