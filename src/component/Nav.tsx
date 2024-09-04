import React from "react";
import './Nav.css';

const Nav: React.FC = () => {
    return (
        <nav className="navbar border-2 border-black">
            <ul>
                <li>Home</li>
                <li>Navigation</li>
                <li>User</li>
                <li>Maps</li>
                <li>Notifications</li>
                <li>Setting</li>
            </ul>
        </nav>
    )
}

export default Nav;