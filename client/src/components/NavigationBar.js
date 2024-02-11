import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logoImage from '../assets/logo.png'
import '../styles/navigation.css'

const NavigationBar = () => {
    const [showNavbar, setShowNavbar] = useState(false)

    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar)
    }

    return (
        <nav className="navbar navigation-bar">
            <div className="container">
                <div className="logo">
                    <img src={logoImage} alt="Logo" />
                </div>
                <div className="menu-icon" onClick={handleShowNavbar}>
                </div>
                <div className={`nav-elements  ${showNavbar && 'active'}`}>
                    <ul>
                        <li>
                            <NavLink to="/">Auctions</NavLink>
                        </li>
                        <li>
                            <NavLink to="/mybids">My Bids</NavLink>
                        </li>
                        <li>
                            <NavLink to="/myprofile">My Profile</NavLink>
                        </li>
                        <li className= "logout">
                            <NavLink to="/signin">Log Out</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavigationBar