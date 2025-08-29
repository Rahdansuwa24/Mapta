import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import "../styles/navbar-user.css";

export default function NavbarUser() {

    // dummy data user
    const user = {
        name: "Danang Santoso Boboiboy",
        position: "PIC",
    };

    const daftarPeserta = ["Budi Santoso", "Siti Aisyah", "Ahmad Ifcel"];

    return (
        <div className="nu-navbar">
            <button className="nu-logout-btn">Logout</button>
            <div className="nu-container">
                <div className="nu-search-bar">
                    <input type="text" placeholder="Search" />
                    <IoSearch />
                </div>

                {/* Profile Dummy */}
                <div className="nu-profile">
                    <span className="nu-name">{user.name}</span>
                    <span className="nu-position">{user.position}</span>
                </div>
            </div>
        </div>
    );
}
