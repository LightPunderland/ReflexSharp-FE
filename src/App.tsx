import Cookies from "js-cookie";
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppRoutes } from './enums/enums';
import Leaderboard from './Leaderboard/Leaderboard';
import Login from './Login/Login';
import Logout from "./Login/Logout";
import Navbar from './Navbar/Navbar';
import Play from './Play/Play';
import Profile from './Profile/Profile';
import Wardrobe from './Wardrobe/Wardrobe';

// interface GoogleSignInResponse {
//     credential: string;
//     clientId: string;
// }

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('userId')); // check if userId is in cookies, if so, user is logged in
    const [userId, setUserId] = useState(Cookies.get('userId')); // L: Maybe use cookies here later?

    useEffect(() => {
        console.log('effect?')
        setUserId(Cookies.get('userId'));
    }, []);


    const handleLogin = (username: string, userId: string) => {
        if (username && userId) {
            console.log("Login Success", username, userId);
            setIsLoggedIn(true);
            setUserId(userId)

        }
    };

    const handleLogout = () => {
        Cookies.remove('userId');
        setIsLoggedIn(false);
        setUserId('');
    }

    // const handleGoogleSignin = (response: GoogleSignInResponse) => {
    //     const token = response.credential;
    //     const userId = response.clientId;
    //     console.log("Google Login Success:", response);
    //     handleLogin(token, token, userId);
    // }


    // Login screen, keep it seperate from app for now as to not mess up game score before loading in

    if (!isLoggedIn || !userId) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to={AppRoutes.Profile} replace />} />
                <Route path={AppRoutes.Play} element={<Play userId={userId} />} />
                <Route path={AppRoutes.Wardrobe} element={<Wardrobe userId={userId} />} />
                <Route path={AppRoutes.Leaderboard} element={<Leaderboard />} />
                <Route path={AppRoutes.Profile} element={<Profile userId={userId} />} />
                <Route path={AppRoutes.Logout} element={<Logout onLogout={handleLogout} />} />
            </Routes >
        </>
    );
}

export default App;
