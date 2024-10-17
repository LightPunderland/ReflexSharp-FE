import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Play from './Play/Play';
import Profile from './Profile/Profile';
import Leaderboard from './Leaderboard/Leaderboard';
import Login from './Login/Login';
import styles from './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Not logged in by default, cookies go here later

    const handleLogin = (username, password) => {
        if (username && password) {
            setIsLoggedIn(true);
        }
    };

    // Login screen, keep it seperate from app for now as to not mess up game score before loading in
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin}/>;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/play" element={<Play />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/leaderboard" element={<Leaderboard/>} />
            </Routes>
        </>
    );
}

export default App;
