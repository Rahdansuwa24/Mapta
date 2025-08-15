import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

import vectorBg from "../assets/images/vector_1.png";

export default function LoginPage() {

    useEffect(() => {
        document.title = "Login Page";
    }, []);

    return (
        <section class="login-section">
            <div className="container">
                <div className="left">
                    <div className="judul">
                    <p>LOGIN</p>
                    </div>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button>Masuk</button>
                </div>
                <div className="right">
                    Selamat datang di <b>MAPTA</b> (Magang Perpustakaan dan Arsip), portal resmi
                    sistem magang Dinas Perpustakaan dan Kearsipan Provinsi Jawa Timur. Silakan login
                    menggunakan email dan password yang telah dibuat sebelumnya. Akses hanya tersedia bagi Admin, PIC, dan
                    peserta magang yang telah dinyatakan diterima melalui proses seleksi.
                </div>
            </div>

            <img
                src={vectorBg}
                alt="vector background"
                className="vector-bg"
            />
        </section>
    );
}
