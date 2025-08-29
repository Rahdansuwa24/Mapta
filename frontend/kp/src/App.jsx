import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/login";
import FormPendaftaran from "./pages/pendaftaran";
import Dashboard from "./pages/admin/dashboard.jsx";
import Diterima from "./pages/admin/penerimaan.jsx";
import Ditolak from "./pages/admin/penolakan.jsx";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pendaftaran" element={<FormPendaftaran />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/admin-penerimaan" element={<Diterima />} />
        <Route path="/admin-penolakan" element={<Ditolak />} />
        <Route path="/admin-jadwal" element={<Jadwal />} />
        <Route path="/admin-penilaian" element={<Penilaian />} />
        <Route path="/admin-data-penilaian" element={<DataPenilaian />} />
        <Route path="/admin-sertifikat" element={<Sertifikat />} />
        <Route path="/admin-pic" element={<AkunPIC />} />
        <Route path="/pic-jadwal" element={<JadwalPIC />} />
        <Route path="/pic-penilaian" element={<PenilaianPIC />} />
        <Route path="/peserta-nilai" element={<NilaiPeserta />} />
        <Route path="/peserta-jadwal" element={<JadwalPeserta />} />
        <Route path="/peserta-sertifikat" element={<SertifikatPeserta />} />
      </Routes>
    </Router>
  );
}

export default App;
