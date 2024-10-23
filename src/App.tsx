import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Leaderboard from './Leaderboard/Leaderboard';
import Login from './Login/Login';
import Navbar from './Navbar/Navbar';
import Play from './Play/Play';
import Profile from './Profile/Profile';
import { AppRoutes } from './enums/enums';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Not logged in by default, cookies go here later

    interface LoginProps {
        onLogin: (username: string, password: string) => void;
    }

    const handleLogin = (username: string, password: string): void => {
        if (username && password) {
            setIsLoggedIn(true);
        }
    };

    // Login screen, keep it seperate from app for now as to not mess up game score before loading in
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path={AppRoutes.Play} element={<Play />} />
                <Route path={AppRoutes.Profile} element={<Profile />} />
                <Route path={AppRoutes.Leaderboard} element={<Leaderboard />} />
            </Routes >
        </>
    );
}

export default App;
