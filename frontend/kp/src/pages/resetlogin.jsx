// PAGE RESET PASSWORD
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/login.css";
import vectorBg from "../assets/images/vector_1.png";
import axios from 'axios'

export default function LoginPage() {
  useEffect(() => {
    document.title = "Change Pasword Page";
  }, []);

  const navigate = useNavigate();
  const [email, setEmail] = useState("")

  const handleSubmit = async(e)=>{
    e.preventDefault();

    if (!email) {
      alert("Semua field harus diisi!");
      return;
    }

    try{
      const response = await axios.patch("http://localhost:3000/peserta/update-password", {email})
      alert(response.data.message);
      navigate("/login");
    }catch(error){
        console.error(error)
      if (error.response) {
        alert(error.response.data.message || "Terjadi kesalahan pada server");
      } else {
        alert("Tidak dapat terhubung ke server");
    }
    }
  }
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
            <p>Change Password</p>
          </div>

          {/* EMAIL INPUT */}
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            className="login-email-input"
            value={email}
             onChange={(e) => setEmail(e.target.value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
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
