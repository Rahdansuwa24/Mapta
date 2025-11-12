// PAGE AKUN PIC ADMIN

import React, { useEffect, useState } from "react";
import SidebarAdmTm from "../../components/sidebar-adm";
import NavbarAdmTm from "../../components/navbar-adm";
import { FaTimes } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import axios from 'axios'
import { toast } from "react-toastify";

import "../../styles/dashboard.css";

const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
        regex.test(part) ? (
        <span key={i} style={{ backgroundColor: "#AFD3F6" }}>{part}</span>
        ) : (
        part
        )
    );
};

function AkunPIC() {
    useEffect(() => {
        document.title = "Admin MAPTA";
    }, []);

    const [searchTerm, setSearchTerm] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [departemen, setDepartemen] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [akunList, setAkunList] = useState([]);

    useEffect(()=>{
        fetchDataAkun()
    }, [])

    const filteredAkun = akunList.filter(
    (akun) =>
    akun.bidang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    akun.email.toLowerCase().includes(searchTerm.toLowerCase())
);

    const fetchDataAkun = async()=>{
            const token = localStorage.getItem("token")
            try{
                const res = await axios.get("http://localhost:3000/admin/pic", {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })
                const dataAkun = res.data.data
                setAkunList(dataAkun)
            }catch(error){
                toast.error("Gagal Mengambil Data Akun PIC")
                console.error(error)
            }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!departemen || !email) {
            toast.error("Harap mengisi kolom email dan departemen");
            return;
        }

        if (editingIndex === null && !password) {
            toast.error("Harap mengisi kolom password");
            return;
        }

        const data = {
            bidang: departemen,
            email,
            password
        };

        try{
            if (editingIndex !== null) {

            const akunId = akunList[editingIndex].id_pic;
            await axios.patch(`http://localhost:3000/admin/pic/update/${akunId}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
            })
                toast.success("Data akun PIC berhasil diperbarui");
            } else {
            await axios.post(`http://localhost:3000/admin/pic/store`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
            })
                toast.success("Data akun PIC berhasil ditambahkan");
            }
            setShowModal(false);
            setDepartemen("");
            setEmail("");
            setPassword("");
            setEditingIndex(null)
            await fetchDataAkun();
        }catch(error){
            console.error("Terjadi kesalahan:", error.response?.message);
            toast.error(`Gagal menambahkan data: ${error.response?.data?.message || "Terjadi kesalahan"}`);

        }

    };

    const handleDelete = async (index) => {
        const akun = akunList[index]
        const akunId = akun.id_users
        const confirmDelete = window.confirm(`Apakah kamu yakin ingin menghapus akun dengan email: ${akun.email}?`)
        if (!confirmDelete) return;
        try{
            const token = localStorage.getItem("token")
            await axios.delete(`http://localhost:3000/admin/pic/delete/${akunId}`,{
                    headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            toast.success("Data akun berhasil dihapus");
            fetchDataAkun(); 
        }catch(error){
            console.error("Terjadi kesalahan:", error.response?.data);
           toast.error(`Gagal menghapus data data: ${error.response?.data?.message || "Terjadi kesalahan"}`);
        }
    };

    const handleEdit = (index) => {
        const akun = akunList[index];
        setDepartemen(akun.bidang);
        setEmail(akun.email);
        setPassword("");
        setEditingIndex(index);
        setShowModal(true);
    };

    return (
        <div className="app-layout">
        <SidebarAdmTm />
        <div className="content-area">
            <NavbarAdmTm onSearch={setSearchTerm}/>

            <section className="main">
            <div className="submain">
                <p className="judul-submain">Manajemen Akun PIC</p>
            </div>

            <div className="container-instansi">
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

                <div className="tabel-wrapper" style={{ marginTop: "5rem" }}>
                <table className="table-wrapper">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Departemen</th>
                        <th>Email</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredAkun.map((akun, idx) => (
                        <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{highlightText(akun.bidang, searchTerm)}</td>
                        <td>{highlightText(akun.email, searchTerm)}</td>
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

            {showModal && (
            <div className="peserta-overlay" onClick={() => setShowModal(false)}>
                <div
                className="peserta-modal"
                onClick={(e) => e.stopPropagation()}
                >
                <div className="peserta-modal-header">
                    <span>{editingIndex !== null ? "Edit Akun PIC" : "Tambah Akun PIC"}</span>
                    <div
                    className="peserta-close-btn"
                    onClick={() => setShowModal(false)}
                    >
                    <FaTimes />
                    </div>
                </div>

                <div className="peserta-modal-body">
                    <form className="form-penilaian" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Departemen</label>
                        <select
                        value={departemen}
                        onChange={(e) => setDepartemen(e.target.value)}
                        >
                        <option value="">-- Pilih Departemen --</option>
                        <option value="Kesekretariatan">Kesekretariatan</option>
                        <option value="Deposit, Pengembangan, dan Pelestarian bahan Perpustakaan">
                            Deposit, Pengembangan, dan Pelestarian bahan Perpustakaan
                        </option>
                        <option value="Pembinaan Perpustakaan">
                            Pembinaan Perpustakaan
                        </option>
                        <option value="Pelayanan Perpustakaan dan Informasi">
                            Pelayanan Perpustakaan dan Informasi
                        </option>
                        <option value="Pemberdayaan dan Pengawasan Kearsipan">
                            Pemberdayaan dan Pengawasan Kearsipan
                        </option>
                        <option value="Penyelamatan dan Pemanfaatan Arsip Statis">
                            Penyelamatan dan Pemanfaatan Arsip Statis
                        </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                        type="email"
                        placeholder="Masukkan email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                        type="text"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

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
