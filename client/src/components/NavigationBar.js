import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.PNG';
import '../styles/navigation.css';

const NavigationBar = () => {
    const [showNavbar, setShowNavbar] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
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
