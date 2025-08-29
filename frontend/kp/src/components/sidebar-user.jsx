import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuAlignJustify } from "react-icons/lu";

import logoMapta from "../assets/images/logo_mapta.png";
import "../styles/sidebar-user.css";

export default function SidebarUser({ menuItems = [] }) { // ✅ default []
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* hamburger mobile */}
            <button 
                className="su-hamburger" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <LuAlignJustify size={20} />
            </button>

            <div className={`su-sidebar ${isOpen ? "open" : ""}`}>
                <div className="su-sidebar-header">
                    <img src={logoMapta} alt="Logo" />
                    <h1>MAPTA</h1>
                </div>

                <div className="su-nav">NAVIGATION</div>

                <div className="su-nav-items">
                    {menuItems.map((item, idx) => (
                        <Link to={item.path} key={idx}>
                            <div className={`su-nav-item ${isActive(item.path) ? "su-active" : ""}`}>
                                <span className="su-icon">{item.icon}</span>
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer khusus mobile */}
                <div className="su-sidebar-footer">
                    <button className="su-logout-btn">Logout</button>
                </div>
            </div>
        </>
    );
}
