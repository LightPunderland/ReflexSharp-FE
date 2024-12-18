import { GoogleLogin } from '@react-oauth/google';
import Cookies from "js-cookie";
import { useState } from 'react';
import styles from './Login.module.css';
import LoginService from './api/Login';
import { useEffect } from 'react';
import { SpriteCache } from '../Play/utility/spriteCache';

interface LoginProps {
    onLogin: (username: string, userId: string) => void;
}

interface GoogleSignInResponse {
    clientId: string;
    credential: string;
    select_by: string;
}
interface GoogleSignInRequestParams {
    clientId: string;
    username: string;
    token: string
}

interface UserDTO {
    id: string;
    googleId: string;
    email: string;
    displayName: string;
    publicRank: string; // Enum values as strings (None, Noob, Pro, etc.)
    xp: number;
    gold: number;
}
function Login({ onLogin }: LoginProps) {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    SpriteCache.skin = "ninja";

    const [username, setUsername] = useState('');
    const [showGoogleSignIn, setShowGoogleSignIn] = useState(false);

    const handleNext = () => {
        if (!username.trim()) {
            alert('Please enter a username');
            return;
        }
        setShowGoogleSignIn(true);

    };

    const handleGoogleSignInSuccess = async (response: GoogleSignInResponse): Promise<void> => {

        try {
            const data: GoogleSignInRequestParams = {
                clientId: response.clientId,
                username: username,
                token: response.credential

            }

            const user: UserDTO = await LoginService.googleSignIn(data);
            setUsername(user.displayName);
            Cookies.set('userId', user.id, { expires: 10 / (24 * 60) });

            sessionStorage.setItem('user', JSON.stringify(user));
            onLogin(user.displayName, user.id);


        } catch (error) {
            console.error("Google Sign-In failed:", error);
            throw error;
        }


        // onLogin(username, token, userId);
    }
    const handleGoogleError = () => {
        console.error("Google Login Failed");
        alert("Google Sign-In failed. Please try again.");
    };



    // Guest usernames will be randomly generated later down the line, for now we will be using a test user
    const handleGuest = () => {
        const guestUsername = 'IamAGuest';
        const userId = 'b6fbd4d9-55f5-481a-a9cf-b274269cbe82'; // MOCK TEST USER ID
        // const guestPassword = "password";
        
        onLogin(guestUsername, userId);
    };

    


    return (
        <div className={styles.loginModal}>
            <div className={styles.loginBox}>
                <h2>Welcome, please login!</h2>
                {!showGoogleSignIn ? (
                    <>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                placeholder="Choose your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className={styles.buttonContainer}>
                            <button
                                className={styles.loginButton}
                                onClick={handleNext}
                            >
                                Next
                            </button>
                            <button className={styles.guestButton} onClick={handleGuest}>
                                Play as Guest
                            </button>
                        </div>
                        {/* <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div> */}
                    </>
                ) : (

                    <div className={styles.googleLoginContainer}>
                        <p>Sign in with Google to continue:</p>
                        <GoogleLogin clientId={clientId}
                            onSuccess={handleGoogleSignInSuccess}
                            onError={handleGoogleError}
                        />
                    </div>
                )}

                {/* <div className={styles.buttonContainer}>
                    <button className={styles.loginButton} onClick={handleLogin}>
                        Login
                    </button>
                    <button className={styles.guestButton} onClick={handleGuest}>
                        Play as Guest
                    </button>
                </div> */}
            </div>
        </div>
    );
}

export default Login;
