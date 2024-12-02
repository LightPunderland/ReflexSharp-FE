import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import leaderboardImage from "../assets/leaderboard.png";
import playImage from "../assets/play.png";
import profileImage from "../assets/profile.png";
import styles from "./Navbar.module.css";

// You get what you deserve @Nojus
//                          - Lukas
import { useState } from "react";
import logoutHover from "../assets/logout-hover.png";
import logoutInactive from "../assets/logout-inactive.png";
import logoutActive from "../assets/logout-active.png";

function Navbar() {
    const [logoutImage, setLogoutImage] = useState(logoutInactive);

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

                    <li>
                        <NavLink to="/profile">
                            <img src={profileImage} alt="Profile" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink onClick={() => {
                            Cookies.remove('userId')

                        }} to="/logout">
                            <img src={logoutImage} alt="Logout"
                                className={styles.logoutImage}
                                onMouseEnter={() => setLogoutImage(logoutHover)}
                                onMouseLeave={() => setLogoutImage(logoutInactive)}
                                onMouseDown={() => setLogoutImage(logoutActive)}
                                onMouseUp={() => setLogoutImage(logoutHover)}
                             />
                        </NavLink>
                    </li>



                </ul>

                {/* <div className={styles.preview}>
                    <ProfileBubble ProfileId={'b6fbd4d9-55f5-481a-a9cf-b274269cbe82'} />
                </div> */}
            </nav>
        </header >
    );
}

export default Navbar;