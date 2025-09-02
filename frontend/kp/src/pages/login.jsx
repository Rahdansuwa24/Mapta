// PAGE LOGIN

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; 
import "../styles/login.css";

import vectorBg from "../assets/images/vector_1.png";

export default function LoginPage() {
    useEffect(() => {
        document.title = "Login Page";
    }, []);

    return (
        <section className="login-section">
            <div className="container">
                {/* LEFT: FORM LOGIN */}
                <motion.div
                    className="left"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="judul">
                        <p>LOGIN</p>
                    </div>
                    <motion.input
                        type="email"
                        placeholder="Email"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    />
                    <motion.input
                        type="password"
                        placeholder="Password"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        Masuk
                    </motion.button>
                </motion.div>

                {/* RIGHT: DESKRIPSI */}
                <motion.div
                    className="right"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                >
                    Selamat datang di <b>MAPTA</b> (Magang Perpustakaan dan Arsip), portal resmi
                    sistem magang Dinas Perpustakaan dan Kearsipan Provinsi Jawa Timur. Silakan login
                    menggunakan email dan password yang telah dibuat sebelumnya. Akses hanya tersedia bagi Admin, PIC, dan
                    peserta magang yang telah dinyatakan diterima melalui proses seleksi.
                </motion.div>
            </div>

            {/* BACKGROUND VECTOR */}
            <motion.img
                src={vectorBg}
                alt="vector background"
                className="vector-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
        </section>
    );
}
