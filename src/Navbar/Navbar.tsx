import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";


function Navbar(){

    return(<header className={styles.header}>
                <nav className={styles['navbar-container']} id="main-bar">
                       
                    <ul className={styles['navbar-list']}>
                        <li><NavLink to="/play"> Play </NavLink></li>
                        <li><NavLink to="/profile"> Profile </NavLink></li>
                        <li><NavLink to="/leaderboard"> Leaderboard </NavLink></li>
                        <li><NavLink to="/login"> Login </NavLink></li>
                    </ul>
                    
                </nav>
            </header>);
}

export default Navbar;