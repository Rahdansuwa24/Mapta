import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import LandingMapta from "./pages/landingpage.jsx";
import LoginPage from "./pages/login";
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

function Protection({children}){
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to='/login'/>
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingMapta />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pendaftaran" element={<FormPendaftaran />} />
        <Route path="/pendaftarandinas" element={<FormPendaftaranDinas />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/admin-dashboard" element={<Protection><Dashboard /></Protection>} />
        <Route path="/admin-penerimaan" element={<Protection><Diterima /></Protection>} />
        <Route path="/admin-penolakan" element={<Protection><Ditolak /></Protection>} />
        <Route path="/admin-selesai" element={<SelesaiMagang />} />
        <Route path="/admin-jadwal" element={<Protection><Jadwal /></Protection>} />
        <Route path="/admin-penilaian" element={<Protection><Penilaian /></Protection>} />
        <Route path="/admin-data-penilaian" element={<DataPenilaian />} />
        <Route path="/admin-sertifikat" element={<Sertifikat />} />
        <Route path="/admin-pic" element={<Protection><AkunPIC /></Protection>} />
        <Route path="/pic-jadwal" element={<Protection><JadwalPIC /></Protection>} />
        <Route path="/pic-penilaian" element={<PenilaianPIC />} />
        <Route path="/peserta-nilai" element={<NilaiPeserta />} />
        <Route path="/peserta-jadwal" element={<JadwalPeserta />} />
        <Route path="/peserta-sertifikat" element={<SertifikatPeserta />} />
      </Routes>
    </Router>
  );
}

export default App;
