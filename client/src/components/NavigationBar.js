import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.PNG';
import '../styles/navigation.css';
import {dispatchAuthEvent} from "../auth";

const NavigationBar = () => {
    const [showNavbar, setShowNavbar] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

     useEffect(() => {
        const tokenCheck = () => setIsAuthenticated(!!localStorage.getItem('token'));
        tokenCheck();

        // Set up the event listener for the custom authChange event
        window.addEventListener('authChange', tokenCheck);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('authChange', tokenCheck);
        };
    }, []);

    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        dispatchAuthEvent();
        navigate('/signin');
    };

    return (
        <nav className="navbar navigation-bar">
            <div className="container">
                <div className="logo">
                    <img src={logoImage} alt="Logo" />
                </div>
                <div className="menu-icon" onClick={handleShowNavbar}>
                    {/* Icon here */}
                </div>
                <div className={`nav-elements ${showNavbar && 'active'}`}>
                    <ul>
                        <li>
                            <NavLink to="/">Auctions</NavLink>
                        </li>
                        {isAuthenticated && (
                            <>
                                <li>
                                    <NavLink to="/mybids">My Bids</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/myprofile">My Profile</NavLink>
                                </li>
                                <li className="logout" onClick={handleLogout}>
                                    Log Out
                                </li>
                            </>
                        )}
                        {!isAuthenticated && (
                            <li>
                                <NavLink to="/signin">Log In</NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
