import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import styles from './Login.module.css';

interface LoginProps {
    onLogin: (username: string, password: string, userId: string) => void;
}

interface GoogleSignInResponse {
    clientId: string;
    credential: string;
    select_by: string;
}
function Login({ onLogin }: LoginProps) {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [showGoogleSignIn, setShowGoogleSignIn] = useState(false);

    const handleLogin = () => {
        onLogin(username, password, userId);

    };

    const handleNext = () => {
        if (!username.trim()) {
            alert('Please enter a username');
            return;
        }
        setShowGoogleSignIn(true);

    };

    const handleGoogleSignInSuccess = (response: GoogleSignInResponse) => {
        // const token = response.credential;
        // const userId = response.clientId;
        console.log("Google Login Success:", response);
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
        const guestPassword = "password";
        onLogin(guestUsername, guestPassword, userId);
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

                <div className={styles.buttonContainer}>
                    <button className={styles.loginButton} onClick={handleLogin}>
                        Login
                    </button>
                    <button className={styles.guestButton} onClick={handleGuest}>
                        Play as Guest
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
