// PAGE LOGIN

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; 
import { ImEye, ImEyeBlocked } from "react-icons/im";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from 'axios'

import vectorBg from "../assets/images/vector_1.png";

export default function LoginPage() {
    useEffect(() => {
        document.title = "Login Page";
    }, []);

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
            email: "",
            password: ""
    })

    const handleChange = (e)=>{
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleLogin = async ()=>{
        try{
            const response = await axios.post("http://localhost:3000/login", formData)
            if(response.data.status){
                localStorage.setItem("token", response.data.token)
                const decoded = jwtDecode(response.data.token)
                console.log(decoded)
                const userLevel = decoded.user_level
                console.log(userLevel)
                if(userLevel === 'admin'){
                    navigate("/admin-dashboard")
                }
                else if(userLevel === 'siswa'){
                    navigate("/peserta-jadwal")
                }
                else if(userLevel === 'pic'){
                    navigate("/pic-jadwal")
                }else{
                    alert("Login gagal, periksa email dan password");
                }
                
            }
        }catch(error){
            console.error("Login error:", error);
            alert("Terjadi kesalahan server");
        }
    }
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
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    />
                    <div className="password-input">
                    <motion.input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    />
                    <span
                        className="toggle-eye"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <ImEyeBlocked /> : <ImEye />}
                    </span>
                    </div>
                    <button onClick={handleLogin}>
                        Masuk
                    </button>
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
