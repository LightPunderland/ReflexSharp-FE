import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import playImage from "../assets/play.png";
import profileImage from "../assets/profile.png";
import leaderboardImage from "../assets/leaderboard.png";
import ProfileBubble from "./Profile-Bubble/Profile-Bubble";
import Profile from "../Profile/Profile";

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
                        <NavLink to="/leaderboard">
                            <img src={leaderboardImage} alt="Leaderboard" />
                        </NavLink>
                    </li>

               

                </ul>

                {/* <div className={styles.preview}>
                    <ProfileBubble ProfileId={'b6fbd4d9-55f5-481a-a9cf-b274269cbe82'} />
                </div> */}
            </nav>
        </header>
    );
}

export default Navbar;