// PAGE AKUN PIC ADMIN

import React, { useEffect, useState } from "react";
import SidebarAdmTm from "../../components/sidebar-adm";
import NavbarAdmTm from "../../components/navbar-adm";
import { FaTimes } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";

import "../../styles/dashboard.css";

function AkunPIC() {
    useEffect(() => {
        document.title = "Admin Akun PIC";
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [departemen, setDepartemen] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);

    // Data dummy awal
    const [akunList, setAkunList] = useState([
        { departemen: "Pengembangan Sumber Daya", email: "perpus@domain.com", password: "123456" },
        { departemen: "Kesekretariatan", email: "arsip@domain.com", password: "abcdef" },
        { departemen: "Penyelamatan dan Pendayagunaan Kearsipan", email: "ppk@domain.com", password: "password1" },
    ]);

    // Tambah / Update akun PIC
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!departemen || !email || !password) {
        alert("Harap lengkapi semua field!");
        return;
        }

        if (editingIndex !== null) {
        // mode edit
        const updated = [...akunList];
        updated[editingIndex] = { departemen, email, password };
        setAkunList(updated);
        } else {
        // mode tambah
        setAkunList([...akunList, { departemen, email, password }]);
        }

        setShowModal(false);
        setDepartemen("");
        setEmail("");
        setPassword("");
        setEditingIndex(null);
    };

    // Hapus akun
    const handleDelete = (index) => {
        const filtered = akunList.filter((_, i) => i !== index);
        setAkunList(filtered);
    };

    // Edit akun
    const handleEdit = (index) => {
        const akun = akunList[index];
        setDepartemen(akun.departemen);
        setEmail(akun.email);
        setPassword(akun.password);
        setEditingIndex(index);
        setShowModal(true);
    };

    return (
        <div className="app-layout">
        <SidebarAdmTm />
        <div className="content-area">
            <NavbarAdmTm />

            <section className="main">
            <div className="submain">
                <p className="judul-submain">Manajemen Akun PIC</p>
            </div>

            <div className="container-instansi">
                {/* HEADER */}
                <div className="penilaian-header">
                <button
                    className="btn-buat-aspek"
                    onClick={() => {
                    setEditingIndex(null);
                    setDepartemen("");
                    setEmail("");
                    setPassword("");
                    setShowModal(true);
                    }}
                >
                    Tambah Akun PIC
                </button>
                </div>

                {/* TABEL DATA AKUN */}
                <div className="tabel-wrapper" style={{ marginTop: "5rem" }}>
                <table className="table-wrapper">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Departemen</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {akunList.map((akun, idx) => (
                        <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{akun.departemen}</td>
                        <td>{akun.email}</td>
                        <td>{akun.password}</td>
                        <td className="aksi-cell">
                            <div className="aksi-wrapper">
                            <TbEdit
                                style={{ cursor: "pointer", marginRight: "10px", fontSize: "22px" }}
                                title="Edit Akun"
                                onClick={() => handleEdit(idx)}
                            />
                            <MdDeleteOutline
                                style={{ cursor: "pointer", color: "red", fontSize: "22px" }}
                                title="Hapus Akun"
                                onClick={() => handleDelete(idx)}
                            />
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            </section>

            {/* MODAL INPUT AKUN PIC */}
            {showModal && (
            <div className="peserta-overlay" onClick={() => setShowModal(false)}>
                <div
                className="peserta-modal"
                onClick={(e) => e.stopPropagation()}
                >
                {/* Header */}
                <div className="peserta-modal-header">
                    <span>{editingIndex !== null ? "Edit Akun PIC" : "Tambah Akun PIC"}</span>
                    <div
                    className="peserta-close-btn"
                    onClick={() => setShowModal(false)}
                    >
                    <FaTimes />
                    </div>
                </div>

                {/* Body */}
                <div className="peserta-modal-body">
                    <form className="form-penilaian" onSubmit={handleSubmit}>
                    {/* Dropdown Departemen */}
                    <div className="form-group">
                        <label>Nama Departemen</label>
                        <select
                        value={departemen}
                        onChange={(e) => setDepartemen(e.target.value)}
                        >
                        <option value="">-- Pilih Departemen --</option>
                        <option value="Kesekretariatan">Kesekretariatan</option>
                        <option value="Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan">
                            Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan
                        </option>
                        <option value="Pelayanan Perpustakaan dan Informasi">
                            Pelayanan Perpustakaan dan Informasi
                        </option>
                        <option value="Pengembangan Sumber Daya">
                            Pengembangan Sumber Daya
                        </option>
                        <option value="Penyelamatan dan Pendayagunaan Kearsipan">
                            Penyelamatan dan Pendayagunaan Kearsipan
                        </option>
                        <option value="Pembinaan dan Pengawasan Kearsipan">
                            Pembinaan dan Pengawasan Kearsipan
                        </option>
                        </select>
                    </div>

                    {/* Input Email */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                        type="email"
                        placeholder="Masukkan email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Input Password */}
                    <div className="form-group">
                        <label>Password</label>
                        <input
                        type="text"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Tombol Simpan */}
                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                        {editingIndex !== null ? "Update" : "Simpan"}
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    );
}

export default AkunPIC;
