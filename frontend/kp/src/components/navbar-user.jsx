import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import "../styles/navbar-user.css";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function NavbarUser() {
const navigate = useNavigate();
    useEffect(()=>{
        const fetchUser = async()=>{
            const token = localStorage.getItem("token")
            if(!token){
                console.warn("token tidak ada atau sudah kadaluarsa")
                setLoading(false)
                return;
            }
            try{
                const decoded = jwtDecode(token)
                setUsers({
                    email: decoded.email,
                    user_level: decoded.user_level
                })

            }catch(error){
                console.error("gagal decode token: ", error.message)
            }
        }
        fetchUser()
    },[])

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    const daftarPeserta = ["Budi Santoso", "Siti Aisyah", "Ahmad Ifcel"];
    const [users, setUsers] = useState({email: "", user_level: ""})
    return (
        <div className="nu-navbar">
            <button className="nu-logout-btn" onClick={handleLogout}>Logout</button>
            <div className="nu-container">
                <div className="nu-search-bar">
                    <input type="text" placeholder="Search" />
                    <IoSearch />
                </div>

                {/* Profile Dummy */}
                <div className="nu-profile">
                    <span className="nu-name">{users.email}</span>
                    <span className="nu-position">{users.user_level}</span>
                </div>
            </div>
        </div>
    );
}
