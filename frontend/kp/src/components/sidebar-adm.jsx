import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsFillHouseFill, BsCollectionFill } from "react-icons/bs";
import { BiSolidCalendar } from "react-icons/bi";
import { RiBallPenFill } from "react-icons/ri";
import { IoDocumentText } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { MdApps } from "react-icons/md";
import { MdArticle } from "react-icons/md";
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import logoMapta from "../assets/images/logo_mapta.png";

import "../styles/sidebar-adm.css";

export default function Sidebar() {
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openAspekDropdown, setOpenAspekDropdown] = useState(false);

    // buka dropdown otomatis jika salah satu itemnya aktif
    useEffect(() => {
        if (
        location.pathname === "/admin-penerimaan" ||
        location.pathname === "/admin-penolakan"
        ) {
        setOpenDropdown(true);
        }
        if (
        location.pathname === "/admin-penilaian" ||
        location.pathname === "/admin-data-penilaian"
        ) {
        setOpenAspekDropdown(true);
        }
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar">
        <div className="sidebar-header">
            <img src={logoMapta} alt="Logo" />
            <h1>MAPTA</h1>
        </div>
        <div className="nav">NAVIGATION</div>

        <div className="nav-items">
            <Link to="/admin-dashboard">
            <div className={`nav-item ${isActive("/admin-dashboard") ? "active" : ""}`}>
                <span className="icon"><BsFillHouseFill /></span>
                Dashboard
            </div>
            </Link>

            {/* Dropdown Daftar */}
            <div className={`dropdown ${openDropdown ? "open" : ""}`}>
            <div
                className="dropdown-toggle"
                onClick={() => setOpenDropdown(!openDropdown)}
            >
                <div className="left">
                <span className="icon"><BsCollectionFill /></span>
                Daftar
                </div>
                <span className="chevron">
                {openDropdown ? <FaChevronUp /> : <FaChevronDown />}
                </span>
            </div>
            <div className={`dropdown-content fade-slide`}>
                <Link to="/admin-penerimaan">
                <div className={`dropdown-item ${isActive("/admin-penerimaan") ? "active" : ""}`}>
                    <span className="icon"><FaCheck /></span>
                    Diterima
                </div>
                </Link>

                <Link to="/admin-penolakan">
                <div className={`dropdown-item ${isActive("/admin-penolakan") ? "active" : ""}`}>
                    <span className="icon"><FaTimes /></span>
                    Ditolak
                </div>
                </Link>
            </div>
            </div>

            <Link to="/admin-jadwal">
            <div className={`nav-item ${isActive("/admin-jadwal") ? "active" : ""}`}>
                <span className="icon"><BiSolidCalendar /></span>
                Jadwal
            </div>
            </Link>

            {/* Dropdown Aspek Penilaian */}
            <div className={`dropdown ${openAspekDropdown ? "open" : ""}`}>
            <div
                className="dropdown-toggle"
                onClick={() => setOpenAspekDropdown(!openAspekDropdown)}
            >
                <div className="left">
                <span className="icon"><MdApps /></span>
                Aspek
                </div>
                <span className="chevron">
                {openAspekDropdown ? <FaChevronUp /> : <FaChevronDown />}
                </span>
            </div>
            <div className={`dropdown-content fade-slide`}>
                <Link to="/admin-penilaian">
                <div className={`dropdown-item ${isActive("/admin-penilaian") ? "active" : ""}`}>
                    <span className="icon"><RiBallPenFill /></span>
                    Buat Aspek
                </div>
                </Link>

                <Link to="/admin-data-penilaian">
                <div className={`dropdown-item ${isActive("/admin-data-penilaian") ? "active" : ""}`}>
                    <span className="icon"><MdArticle /></span>
                    Data Nilai Aspek
                </div>
                </Link>
            </div>
            </div>

            <Link to="/admin-sertifikat">
            <div className={`nav-item ${isActive("/admin-sertifikat") ? "active" : ""}`}>
                <span className="icon"><IoDocumentText /></span>
                Sertifikat
            </div>
            </Link>

            <Link to="/admin-pic">
            <div className={`nav-item ${isActive("/admin-pic") ? "active" : ""}`}>
                <span className="icon"><HiUserGroup /></span>
                Akun PIC
            </div>
            </Link>
        </div>
        </div>
    );
}
