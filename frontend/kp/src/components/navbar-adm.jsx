import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/navbar-adm.css";
import {jwtDecode} from "jwt-decode";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export default function NavbarAdm({ onSearch, onNewNotif }) {
  const navigate = useNavigate();

  const [users, setUsers] = useState({ email: "", user_level: "" });
  const [loading, setLoading] = useState(true);
  const [notifList, setNotifList] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [notifReadIds, setNotifReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem("notifReadIds");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const decoded = jwtDecode(token);
        setUsers({ email: decoded.email, user_level: decoded.user_level });
      } catch (error) {
        console.error("Gagal decode token: ", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "notifikasi"),
      orderBy("tanggal", "asc"),
      limit(6)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const latestNotif = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        tanggal: doc.data().tanggal?.toDate
          ? doc.data().tanggal.toDate().toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })
          : "-",
      }));

      setNotifList(latestNotif);

      const lastPopupId = localStorage.getItem("lastPopupId")
      const newestDoc = latestNotif[latestNotif.length - 1];

      if (newestDoc && newestDoc.id !== lastPopupId) {
        setShowNotif(true);
        localStorage.setItem("lastPopupId", newestDoc.id);
        if (onNewNotif) onNewNotif(newestDoc);
      }

    });

    return () => unsubscribe();
  }, [onNewNotif]);

  const notifCount = notifList.filter((n) => !notifReadIds.includes(n.id)).length;

  const handleBellClick = () => {
    setShowNotif(!showNotif);

    const allIds = notifList.map((n) => n.id);
    setNotifReadIds(allIds);
    localStorage.setItem("notifReadIds", JSON.stringify(allIds));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (showNotif) {
      const timer = setTimeout(() => setShowNotif(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [showNotif]);

  return (
    <div className="navbar">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        <div className="icon-btn" style={{ position: "relative", cursor: "pointer" }} onClick={handleBellClick}>
          <FaBell />
          {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
        </div>

        {showNotif && notifList.length > 0 && (
          <div className="notif-popup">
            <p>Ada {notifCount} notifikasi baru!</p>
            <ul>
              {notifList.slice().reverse().map((item) => (
                <li
                  key={item.id}
                  style={{ cursor: "pointer", color: "#1A3359" }}
                  onClick={() => navigate("/admin-dashboard")}
                >
                  <strong>{item.title}</strong> — {item.pesan}
                  <br />
                  <small>{item.tanggal}</small>
                </li>
              ))}
            </ul>
            {notifList.length >= 5 && (
              <p style={{ fontSize: "12px", color: "gray" }}>Menampilkan 5 notifikasi terbaru</p>
            )}
          </div>
        )}

        <div className="search-bar">
          <input type="text" placeholder="cari nama/instansi/tgl" onChange={(e) => onSearch(e.target.value)} />
          <IoSearch />
        </div>

        <div className="profile">
          {loading ? (
            <span>Loading....</span>
          ) : users ? (
            <>
              <span className="name">{users.email}</span>
              <span className="position">{users.user_level}</span>
            </>
          ) : (
            <span>User tidak ditemukan</span>
          )}
        </div>
      </div>
    </div>
  );
}
    