import { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Leaderboard from './Leaderboard/Leaderboard';
import Login from './Login/Login';
import Navbar from './Navbar/Navbar';
import Play from './Play/Play';
import Profile from './Profile/Profile';
import { AppRoutes } from './enums/enums';

// interface GoogleSignInResponse {
//     credential: string;
//     clientId: string;
// }

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Not logged in by default, cookies go here later
    const [userId, setUserId] = useState(''); // L: Maybe use cookies here later?
 


    const handleLogin = (username: string, userId: string) => {
        if (username && userId) {
            console.log("Login Success", username, userId);
            setIsLoggedIn(true);
            setUserId(userId)
        }
    };

    // const handleGoogleSignin = (response: GoogleSignInResponse) => {
    //     const token = response.credential;
    //     const userId = response.clientId;
    //     console.log("Google Login Success:", response);
    //     handleLogin(token, token, userId);
    // }

  
    // Login screen, keep it seperate from app for now as to not mess up game score before loading in
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to={AppRoutes.Profile} replace />} />
                <Route path={AppRoutes.Play} element={<Play userId={userId} />} />
                <Route path={AppRoutes.Leaderboard} element={<Leaderboard />} />
                <Route path={AppRoutes.Profile} element={<Profile userId={userId} />} />
            </Routes >
        </>
    );
}

export default App;
