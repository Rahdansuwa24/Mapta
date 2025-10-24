import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./index.css";
import LandingMapta from "./pages/landingpage.jsx";
import LoginPage from "./pages/login";
import ResetLogin from "./pages/resetlogin";
import FormPendaftaran from "./pages/pendaftaran";
import FormPendaftaranDinas from "./pages/pendaftarandinas.jsx";
import ChooseRole from "./pages/chooserole.jsx";
import Dashboard from "./pages/admin/dashboard.jsx";
import Diterima from "./pages/admin/penerimaan.jsx";
import Ditolak from "./pages/admin/penolakan.jsx";
import SelesaiMagang from "./pages/admin/selesai.jsx";
import Jadwal from "./pages/admin/jadwal.jsx";
import Penilaian from "./pages/admin/penilaian.jsx";
import DataPenilaian from "./pages/admin/datapenilaian.jsx";
import Sertifikat from "./pages/admin/sertifikat.jsx";
import AkunPIC from "./pages/admin/akunpic.jsx";
import JadwalPIC from "./pages/userpic/jadwalpic.jsx";
import PenilaianPIC from "./pages/userpic/penilaianpic.jsx";
import NilaiPeserta from "./pages/userpeserta/nilaipeserta.jsx";
import JadwalPeserta from "./pages/userpeserta/jadwalpeserta.jsx";
import SertifikatPeserta from "./pages/userpeserta/sertifikatpeserta.jsx";
import {jwtDecode} from "jwt-decode";
import axios from 'axios';
import { useEffect } from "react";

function Protection({allowedRoles, children}){
  const token = localStorage.getItem("token")
  if(!token){
    return <Navigate to='/login' replace/>
  }
  try{
    const decoded = jwtDecode(token)
    const userLevel = decoded.user_level

    const currentTimes = Date.now() / 1000
    if(decoded.exp < currentTimes){
      localStorage.removeItem("token")
      return <Navigate to="/login" replace />;
    }
    if(allowedRoles && !allowedRoles.includes(userLevel)){
      const path =  userLevel === 'admin' ? "/admin-dashboard" :
                    userLevel === 'siswa' ? "/peserta-jadwal" : 
                    userLevel === 'pic' ? "/pic-jadwal" : "/login";
      if(path !== "/login") {
        return <Navigate to={path} replace />;
      }
    }
    return children
  }catch(error){
    console.error("token invalid", error)
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
  
}
function App() {
  useEffect(()=>{
    const constraints = axios.interceptors.response.use(
      (response)=> response,
      (error)=> {
        const originalRequest = error.config

        if(error.response && error.response.status === 401 && originalRequest.url !== "http://localhost:3000/login"){
          localStorage.removeItem("token");
          window.location.href = '/login'; 
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    )
    return()=>{
      axios.interceptors.response.eject(constraints);
    }
  }, [])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingMapta />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ResetLogin />} />
        <Route path="/pendaftaran" element={<FormPendaftaran />} />
        <Route path="/pendaftarandinas" element={<FormPendaftaranDinas />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/admin-dashboard" element={<Protection allowedRoles={['admin']}><Dashboard /></Protection>} />
        <Route path="/admin-penerimaan" element={<Protection allowedRoles={['admin']}><Diterima /></Protection>} />
        <Route path="/admin-penolakan" element={<Protection allowedRoles={['admin']}><Ditolak /></Protection>} />
        <Route path="/admin-selesai" element={<Protection allowedRoles={['admin']}><SelesaiMagang /></Protection>} />
        <Route path="/admin-jadwal" element={<Protection allowedRoles={['admin']}><Jadwal /></Protection>} />
        <Route path="/admin-penilaian" element={<Protection allowedRoles={['admin']}><Penilaian /></Protection>} />
        <Route path="/admin-data-penilaian" element={<Protection allowedRoles={['admin']}><DataPenilaian /></Protection>} />
        <Route path="/admin-sertifikat" element={<Protection allowedRoles={['admin']}><Sertifikat /></Protection>} />
        <Route path="/admin-pic" element={<Protection><AkunPIC /></Protection>} />
        <Route path="/pic-jadwal" element={<Protection allowedRoles={['pic']}><JadwalPIC /></Protection>} />
        <Route path="/pic-penilaian" element={<Protection allowedRoles={['pic']}><PenilaianPIC /></Protection>} />
        <Route path="/peserta-nilai" element={<Protection allowedRoles={['siswa']}><NilaiPeserta /></Protection>} />
        <Route path="/peserta-jadwal" element={<Protection allowedRoles={['siswa']}><JadwalPeserta /></Protection>} />
        <Route path="/peserta-sertifikat" element={<Protection allowedRoles={['siswa']}><SertifikatPeserta /></Protection>} />
      </Routes>
    </Router>
  );
}

export default App;
