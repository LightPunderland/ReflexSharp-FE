import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import playImage from "../assets/play.png";
import profileImage from "../assets/profile.png";
import leaderboardImage from "../assets/leaderboard.png";

function Navbar() {
    return (
        <header className={styles.header}>
            <nav className={styles['navbar-container']} id="main-bar">
                <ul className={styles['navbar-list']}>
                    <li>
                        <NavLink to="/play">
                            <img src={playImage} alt="Play" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile">
                            <img src={profileImage} alt="Profile" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/leaderboard">
                            <img src={leaderboardImage} alt="Leaderboard" />
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;