// PAGE RESET PASSWORD
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; 
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/login.css";

import vectorBg from "../assets/images/vector_1.png";

export default function LoginPage() {
    useEffect(() => {
        document.title = "Login Page";
    }, []);

    const navigate = useNavigate();

    return (
        <section className="login-section">
            <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft size={18} />
            </button>
            <div className="reset-cont">
                {/* LEFT: FORM LOGIN */}
                <motion.div
                    className="left"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="judul">
                        <p>Forgot Password</p>
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
                        placeholder="New Password"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    />
                    <motion.input
                        type="password"
                        placeholder="Confirm Password"
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
                        Confirm
                    </motion.button>
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
