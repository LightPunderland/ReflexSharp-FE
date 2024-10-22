import { useState } from 'react';
import styles from './Login.module.css';

interface LoginProps {
    onLogin: (username: string, password: string) => void;
}

function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        onLogin(username, password);
    };

    // Guest usernames will be randomly generated later down the line, for now we will be using a test user
    const handleGuest = () => {
        const guestUsername = 'testas';
        const guestPassword = 'testUser123';
        onLogin(guestUsername, guestPassword);
    };

    return (
        <div className={styles.loginModal}>
            <div className={styles.loginBox}>
                <h2>Login</h2>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
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
