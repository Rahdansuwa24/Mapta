import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // untuk navigasi
import "../styles/navbar-adm.css";
import {jwtDecode} from "jwt-decode";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    transports: ["websocket"],
    reconnection: true,
});

export default function NavbarAdm({ onSearch }) {
    const navigate = useNavigate();

    const [users, setUsers] = useState({email: "", user_level: ""})
    const [loading, setLoading] = useState(true)

    const daftarPeserta = ["Budi Santoso", "Siti Aisyah", "Ahmad Ifcel"];

    // state notif
    const [notifList, setNotifList] = useState([]); // daftar pesan
    const [showNotif, setShowNotif] = useState(false);
    const [notifRead, setNotifRead] = useState(false);

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
            }finally{
                setLoading(false)
            }
        }
        fetchUser()
    },[])

    useEffect(()=>{
        socket.on("connect", ()=>{
            console.log("Terhubung ke WebSocket Server");
        })

        socket.on("notifikasi", (data)=>{
            console.log("Notifikasi baru:", data);

            setNotifList((prev)=>{
                const updated = [...prev, data]
                console.log("notifList (update):", updated);
                return updated.slice(-6)
            })
            setShowNotif(true);
            setNotifRead(false);
        })

        //clean-up
        return () => {
            socket.off("notifikasi");
        };
    }, [])

    //hitung jumlah notif yang belum dibaca
    const notifCount = notifRead ? 0 : notifList.length;
    //handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    // hilangkan popup otomatis setelah 5 detik
    useEffect(() => {
        if (showNotif) {
        const timer = setTimeout(() => setShowNotif(false), 5000);
        return () => clearTimeout(timer);
        }
    }, [showNotif]);

    return (
        <div className="navbar">
        <button className="logout-btn"onClick={handleLogout}>Logout</button>
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            
            {/* Bell Icon dengan badge */}
            <div
            className="icon-btn"
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => {
                console.log("Bell diklik!");
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
            {showNotif && notifList.length > 0 &&(
            <div className="notif-popup">
                <p>Ada {notifList.length} notifikasi baru!</p>
                <ul>
                {notifList.slice().reverse().map((item, i) => (
                    <li
                    key={i}
                    style={{ cursor: "pointer", color: "#1A3359" }}
                    onClick={() => navigate("/admin-dashboard")} // arahkan ke dashboard
                    >
                    <strong>{item.title}</strong> — {item.pesan}
                    <br />
                    <small>{item.tanggal}</small>
                    </li>
                ))}
                </ul>
                {notifList.length >= 5 && (
                    <p style={{ fontSize: "12px", color: "gray" }}>
                        Menampilkan 5 notifikasi terbaru
                    </p>
                )}
            </div>
            )}
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="cari nama/instansi/tgl"
                    onChange={(e) => onSearch(e.target.value)}
                />
                <IoSearch />
            </div>

            {/* Profile Dummy */}
            <div className="profile">
                {loading ? (<span>Loading....</span>):users ?(
                    <>
                    <span className="name">{users.email}</span>
                    <span className="position">{users.user_level}</span>
                    </>
                ): ( <span>User tidak ditemukan</span>)}
    
            </div>
        </div>
        </div>
    );
}
