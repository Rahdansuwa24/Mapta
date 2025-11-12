import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsFillHouseFill, BsCollectionFill } from "react-icons/bs";
import { BiSolidCalendar } from "react-icons/bi";
import { RiBallPenFill } from "react-icons/ri";
import { IoDocumentText } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { FaFileDownload } from "react-icons/fa";
import { MdApps, MdArticle } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import logoMapta from "../assets/images/logo_mapta.png";

import "../styles/sidebar-adm.css";

export default function Sidebar() {
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openAspekDropdown, setOpenAspekDropdown] = useState(false);
    const [openJadwalDropdown, setOpenJadwalDropdown] = useState(false);

    // buka dropdown otomatis jika salah satu itemnya aktif
    useEffect(() => {
        if (
            location.pathname === "/admin-penerimaan" ||
            location.pathname === "/admin-penolakan" ||
            location.pathname === "/admin-selesai"
        ) {
            setOpenDropdown(true);
        }
        if (
            location.pathname === "/admin-penilaian" ||
            location.pathname === "/admin-data-penilaian"
        ) {
            setOpenAspekDropdown(true);
        }
        if (
            location.pathname === "/admin-jadwal" ||
            location.pathname === "/admin-jadwal-sekre" ||
            location.pathname === "/admin-jadwal-dpp" ||
            location.pathname === "/admin-jadwal-pp" ||
            location.pathname === "/admin-jadwal-ppi" ||
            location.pathname === "/admin-jadwal-ppk" ||
            location.pathname === "/admin-jadwal-ppas"
        ) {
            setOpenJadwalDropdown(true);
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
                    <div className="dropdown-toggle" onClick={() => setOpenDropdown(!openDropdown)}>
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

                        <Link to="/admin-selesai">
                            <div className={`dropdown-item ${isActive("/admin-selesai") ? "active" : ""}`}>
                                <span className="icon"><AiOutlineFileDone /></span>
                                Selesai Magang
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Dropdown Jadwal */}
                <div className={`dropdown ${openJadwalDropdown ? "open" : ""}`}>
                    <div
                        className="dropdown-toggle"
                        onClick={() => setOpenJadwalDropdown(!openJadwalDropdown)}
                    >
                        <div className="left">
                            <span className="icon"><BiSolidCalendar /></span>
                            Jadwal
                        </div>
                        <span className="chevron">
                            {openJadwalDropdown ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                    </div>
                    <div className={`dropdown-content fade-slide`}>
                        <Link to="/admin-jadwal">
                            <div className={`dropdown-item ${isActive("/admin-jadwal") ? "active" : ""}`}>
                                Buat Jadwal
                            </div>
                        </Link>
                        <Link to="/admin-jadwal-sekre">
                            <div className={`dropdown-item ${isActive("/admin-jadwal-sekre") ? "active" : ""}`}>
                                Sekretariat
                            </div>
                        </Link>
                        <Link to="/admin-jadwal-dpp">
                            <div className={`dropdown-item ${isActive("/admin-jadwal-dpp") ? "active" : ""}`}>
                                DPP
                            </div>
                        </Link>
                        <Link to="/admin-jadwal-pp">
                            <div className={`dropdown-item ${isActive("/admin-jadwal-pp") ? "active" : ""}`}>
                                PP
                            </div>
                        </Link>
                        <Link to="/admin-jadwal-ppi">
                            <div className={`dropdown-item ${isActive("/admin-jadwal-ppi") ? "active" : ""}`}>
                                PPI
                            </div>
                        </Link>
                        <Link to="/admin-jadwal-ppk">
                            <div className={`dropdown-item ${isActive("/admin-jadwal-ppk") ? "active" : ""}`}>
                                PPK
                            </div>
                        </Link>
                        <Link to="/admin-jadwal-ppas">
                            <div className={`dropdown-item ${isActive("/admin-jadwal-ppas") ? "active" : ""}`}>
                                PPAS
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Dropdown Aspek Penilaian */}
                <div className={`dropdown ${openAspekDropdown ? "open" : ""}`}>
                    <div className="dropdown-toggle" onClick={() => setOpenAspekDropdown(!openAspekDropdown)}>
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

                <Link
                    to="#"
                    onClick={() => {
                        const link = document.createElement("a");
                        link.href = "/files/buku-panduan-admin.pdf";
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                >
                    <div className={`nav-item ${isActive("/buku-panduan") ? "active" : ""}`}>
                        <span className="icon"><FaFileDownload /></span>
                        Buku Panduan
                    </div>
                </Link>
            </div>
        </div>
    );
}
