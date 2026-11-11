import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserShield, FaUserTie, FaUserGraduate, FaCopy, FaCheck, FaTimes, FaKey } from "react-icons/fa";
import "../styles/demo-modal.css";

const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    category: "admin",
    icon: <FaUserShield className="text-blue-600" />,
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Kelola kuota, verifikasi pendaftaran, rotasi divisi, dan cetak sertifikat resmi.",
    users: [
      { email: "admin@mapta.id", name: "Admin Utama Disperpusip", roleDesc: "Super Admin" },
      { email: "admin1@gmail.com", name: "Admin Pendamping", roleDesc: "Staff Admin" },
    ],
  },
  {
    role: "PIC / Pembimbing",
    category: "pic",
    icon: <FaUserTie className="text-amber-600" />,
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Mentor lapangan yang memberi penilaian aspek teknis dan non-teknis peserta magang.",
    users: [
      { email: "pic.deposit@mapta.id", name: "PIC Deposit & Pengolahan", roleDesc: "Divisi Deposit & Pengolahan Bahan Pustaka" },
      { email: "pic.psd@mapta.id", name: "PIC Pengembangan SD", roleDesc: "Divisi Pengembangan Sumber Daya" },
      { email: "pic.kearsipan@mapta.id", name: "PIC Kearsipan", roleDesc: "Divisi Penyelamatan & Pendayagunaan Arsip" },
    ],
  },
  {
    role: "Peserta (Selesai Magang)",
    category: "peserta-selesai",
    icon: <FaUserGraduate className="text-emerald-600" />,
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Peserta yang telah lulus evaluasi: siap melihat rekap nilai final dan mengunduh sertifikat PDF.",
    users: [
      { email: "ahmad.fauzi@pens.ac.id", name: "Ahmad Fauzi", roleDesc: "PENS Surabaya (Web & Data Analyst Intern)" },
      { email: "citra.lestari@ub.ac.id", name: "Citra Lestari", roleDesc: "Universitas Brawijaya (Digital Archiving Intern)" },
    ],
  },
  {
    role: "Peserta (Aktif Magang)",
    category: "peserta-aktif",
    icon: <FaUserGraduate className="text-purple-600" />,
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    description: "Peserta yang sedang aktif magang: memantau jadwal penempatan divisi dan unggah laporan.",
    users: [
      { email: "dewi.rahmawati@unair.ac.id", name: "Dewi Rahmawati", roleDesc: "Universitas Airlangga (Library Preservation Intern)" },
      { email: "budi.santoso@its.ac.id", name: "Budi Santoso", roleDesc: "ITS Surabaya (Systems Infrastructure Intern)" },
    ],
  },
];

export default function DemoAccountsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredCategories =
    activeTab === "all"
      ? DEMO_ACCOUNTS
      : DEMO_ACCOUNTS.filter((item) => item.category === activeTab);

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="mapta-demo-trigger"
        aria-label="Lihat Akun Demo"
        title="Klik untuk melihat daftar akun demo MAPTA"
      >
        <span className="demo-trigger-icon">
          <FaKey />
        </span>
        <span className="demo-trigger-text">Akun Demo</span>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="mapta-demo-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="mapta-demo-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="demo-modal-header">
              <div className="demo-header-title">
                <div className="demo-icon-badge">
                  <FaKey />
                </div>
                <div>
                  <h3>Akun Demo Portofolio MAPTA</h3>
                  <p>Pilih akun di bawah untuk menguji alur kerja setiap peran pengguna</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="demo-close-btn"
                aria-label="Tutup modal"
              >
                <FaTimes />
              </button>
            </div>

            {/* Global Password Notice */}
            <div className="demo-password-banner">
              <div className="password-info">
                <span className="label">Password default seluruh akun:</span>
                <code className="pass-code">Password123!</code>
              </div>
              <button
                onClick={() => handleCopy("Password123!", "global-pass")}
                className="copy-btn copy-pass"
                title="Salin Password"
              >
                {copiedKey === "global-pass" ? (
                  <>
                    <FaCheck className="text-emerald-500" /> Tersalin!
                  </>
                ) : (
                  <>
                    <FaCopy /> Salin Password
                  </>
                )}
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="demo-tabs">
              <button
                className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                Semua Role
              </button>
              <button
                className={`tab-btn ${activeTab === "admin" ? "active" : ""}`}
                onClick={() => setActiveTab("admin")}
              >
                Admin
              </button>
              <button
                className={`tab-btn ${activeTab === "pic" ? "active" : ""}`}
                onClick={() => setActiveTab("pic")}
              >
                PIC Pembimbing
              </button>
              <button
                className={`tab-btn ${activeTab === "peserta-selesai" ? "active" : ""}`}
                onClick={() => setActiveTab("peserta-selesai")}
              >
                Peserta (Selesai)
              </button>
              <button
                className={`tab-btn ${activeTab === "peserta-aktif" ? "active" : ""}`}
                onClick={() => setActiveTab("peserta-aktif")}
              >
                Peserta (Aktif)
              </button>
            </div>

            {/* Content List */}
            <div className="demo-modal-body">
              {filteredCategories.map((cat, idx) => (
                <div key={idx} className="demo-category-card">
                  <div className="category-header">
                    <span className="category-icon">{cat.icon}</span>
                    <div>
                      <h4>{cat.role}</h4>
                      <p className="category-desc">{cat.description}</p>
                    </div>
                  </div>

                  <div className="user-grid">
                    {cat.users.map((user, uIdx) => {
                      const copyId = `user-${idx}-${uIdx}`;
                      return (
                        <div key={uIdx} className="user-card">
                          <div className="user-card-top">
                            <span className="user-name">{user.name}</span>
                            <span className="user-desc">{user.roleDesc}</span>
                          </div>
                          <div className="user-card-bottom">
                            <code className="user-email">{user.email}</code>
                            <button
                              onClick={() => handleCopy(user.email, copyId)}
                              className="copy-btn copy-email"
                              title="Salin Email"
                            >
                              {copiedKey === copyId ? (
                                <>
                                  <FaCheck className="text-emerald-500" /> Tersalin
                                </>
                              ) : (
                                <>
                                  <FaCopy /> Salin
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="demo-modal-footer">
              <span className="footer-note">
                Catatan: Anda dapat langsung menuju ke halaman login setelah menyalin kredensial.
              </span>
              <div className="footer-actions">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="go-login-btn"
                >
                  Buka Halaman Login &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
