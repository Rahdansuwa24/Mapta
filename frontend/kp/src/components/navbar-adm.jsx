import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // untuk navigasi
import "../styles/navbar-adm.css";

export default function NavbarAdm() {
    const navigate = useNavigate();

    // dummy data user
    const user = {
        name: "Danang Susetyo Pranawa Susilo Himel",
        position: "Admin",
    };

    const daftarPeserta = ["Budi Santoso", "Siti Aisyah", "Ahmad Ifcel"];

    // state notif
    const notifCount = daftarPeserta.length;
    const [showNotif, setShowNotif] = useState(false);
    const [notifRead, setNotifRead] = useState(false);

    // hilangkan popup otomatis setelah 5 detik
    useEffect(() => {
        if (showNotif) {
        const timer = setTimeout(() => setShowNotif(false), 5000);
        return () => clearTimeout(timer);
        }
    }, [showNotif]);

    return (
        <div className="navbar">
        <button className="logout-btn">Logout</button>
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            
            {/* Bell Icon dengan badge */}
            <div
            className="icon-btn"
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => {
                setShowNotif(!showNotif);
                setNotifRead(true); // tandai notif sudah dibaca
            }}
            >
            <FaBell />
            {!notifRead && notifCount > 0 && (
                <span className="notif-badge">{notifCount}</span>
            )}
            </div>

            {/* Popup Notifikasi */}
            {showNotif && (
            <div className="notif-popup">
                <p>Ada {notifCount} peserta baru mendaftar!</p>
                <ul>
                {daftarPeserta.map((nama, i) => (
                    <li
                    key={i}
                    style={{ cursor: "pointer", color: "#1A3359" }}
                    onClick={() => navigate("/admin-dashboard")} // arahkan ke dashboard
                    >
                    {nama} mendaftar
                    </li>
                ))}
                </ul>
            </div>
            )}
            
            <div className="search-bar">
            <input type="text" placeholder="Search" />
            <IoSearch />
            </div>

            {/* Profile Dummy */}
            <div className="profile">
            <span className="name">{user.name}</span>
            <span className="position">{user.position}</span>
            </div>
        </div>
        </div>
    );
}
