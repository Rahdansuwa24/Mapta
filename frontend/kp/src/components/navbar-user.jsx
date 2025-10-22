import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import "../styles/navbar-user.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function NavbarUser({ onSearch, showSearch = true }) {
    const navigate = useNavigate();
    const [users, setUsers] = useState({ email: "", user_level: "" });

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.warn("token tidak ada atau sudah kadaluarsa");
                return;
            }
            try {
                const decoded = jwtDecode(token);
                setUsers({
                    email: decoded.email,
                    user_level: decoded.user_level,
                });
            } catch (error) {
                console.error("gagal decode token: ", error.message);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="nu-navbar">
            <button className="nu-logout-btn" onClick={handleLogout}>
                Logout
            </button>

            <div className="nu-container">
                {showSearch && (
                    <div className="nu-search-bar">
                        <input
                            type="text"
                            placeholder="cari nama/instansi/tgl"
                            onChange={(e) => onSearch?.(e.target.value)}
                        />
                        <IoSearch />
                    </div>
                )}

                <div className="nu-profile">
                    <span className="nu-name">{users.email}</span>
                    <span className="nu-position">{users.user_level}</span>
                </div>
            </div>
        </div>
    );
}
