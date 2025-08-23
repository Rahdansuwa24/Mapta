// PAGE DITERIMA ADMIN

import React, { useEffect, useState } from "react";
import SidebarAdmTm from "../../components/sidebar-adm";
import NavbarAdmTm from "../../components/navbar-adm";
import { LuAlignJustify } from "react-icons/lu";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

import "../../styles/dashboard.css";

import profil1 from "../../assets/images/profil1.jpg";
import profil2 from "../../assets/images/profil2.jpeg";

function Diterima() {
    useEffect(() => {
        document.title = "Admin Penerimaan";
    }, []);

    const pesertaDummy = [
        {
            id: 1,
            nama: "Budi Santoso",
            nim: "1234567890",
            instansi: "Politeknik Elektronika Negeri Surabaya",
            tglMulai: "01-09-2025",
            tglSelesai: "30-11-2025",
            kategori: "Individu",
            status: "Diterima",
            email: "budi.santoso@gmail.com",
            password: "budi123",
            profil: profil1,
            dokumen: ["Surat_Pengantar.pdf", "Proposal.pdf"]
        },
        {
            id: 2,
            nama: "Danang Cosmos",
            nim: "67854645667",
            instansi: "Politeknik Elektronika Negeri Surabaya",
            tglMulai: "01-09-2025",
            tglSelesai: "30-11-2025",
            kategori: "Individu",
            status: "Diterima",
            email: "danang.cosmos@gmail.com",
            password: "danang123",
            profil: profil1,
            dokumen: ["Surat_Pengantar.pdf", "Proposal.pdf"]
        },
        {
            id: 3,
            nama: "Siti Aisyah",
            nim: "9876543210",
            instansi: "Politeknik Elektronika Negeri Surabaya",
            tglMulai: "01-09-2025",
            tglSelesai: "30-11-2025",
            kategori: "Kelompok",
            status: "Diterima",
            email: "siti.aisyah@gmail.com",
            password: "siti123",
            profil: profil2,
            dokumen: ["Surat_Pengantar.pdf", "Proposal.pdf"]
        },
        {
            id: 4,
            nama: "Ahmad Ifcel",
            nim: "1122334455",
            instansi: "Universitas Airlangga",
            tglMulai: "05-09-2025",
            tglSelesai: "05-12-2025",
            kategori: "Individu",
            status: "Diterima",
            email: "ahmad.fauzi@gmail.com",
            password: "ahmad123",
            profil: profil1,
            dokumen: ["Surat_Pengantar.pdf"]
        },
    ];

    const [showModal, setShowModal] = useState(false);
    const [uploadedStatus, setUploadedStatus] = useState({});
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [filterInstansi, setFilterInstansi] = useState("");
    const [openInstansi, setOpenInstansi] = useState({});
    const [fileUploads, setFileUploads] = useState({});

    const handleOpenModal = (peserta) => {
        setSelectedPeserta(peserta);
        setShowModal(true);
    };

    const handleFileChange = (pesertaId, e) => {
        setFileUploads({
            ...fileUploads,
            [pesertaId]: e.target.files[0]
        });
    };

    const handleUpload = (pesertaId) => {
        if (fileUploads[pesertaId]) {
        alert(
            `File "${fileUploads[pesertaId].name}" berhasil diupload untuk peserta ID ${pesertaId}`
        );
        setUploadedStatus({ ...uploadedStatus, [pesertaId]: true });
        setFileUploads({ ...fileUploads, [pesertaId]: null });
        } else {
        alert("Pilih file terlebih dahulu!");
        }
    };

    const pesertaFiltered = filterInstansi
        ? pesertaDummy.filter((p) => p.instansi === filterInstansi)
        : pesertaDummy;

    const instansiList = [
        ...new Set(pesertaDummy.map((p) => p.instansi))
    ];

    const pesertaPerInstansi = pesertaFiltered.reduce((acc, peserta) => {
        if (!acc[peserta.instansi]) acc[peserta.instansi] = [];
        acc[peserta.instansi].push(peserta);
        return acc;
    }, {});

    const toggleInstansi = (instansi) => {
        setOpenInstansi((prev) => ({
            ...prev,
            [instansi]: !prev[instansi],
        }));
    };

    useEffect(() => {
        const initialState = {};
        Object.keys(pesertaPerInstansi).forEach(instansi => {
            initialState[instansi] = true;
        });
        setOpenInstansi(initialState);
    }, [filterInstansi]);

    return (
        <div className="app-layout">
            <SidebarAdmTm />
            <div className="content-area">
                <NavbarAdmTm />

                <section className="main">
                    <div className="submain">
                        <p className="judul-submain">Peserta Magang yang Diterima</p>
                        <select
                            className="dropdown-instansi"
                            value={filterInstansi}
                            onChange={(e) => setFilterInstansi(e.target.value)}
                        >
                            <option value="">Pilih Instansi</option>
                            {instansiList.map((instansi, idx) => (
                                <option key={idx} value={instansi}>
                                    {instansi}
                                </option>
                            ))}
                        </select>
                    </div>

                    {Object.keys(pesertaPerInstansi).map((instansi) => {
                        const pesertaInstansi = pesertaPerInstansi[instansi];
                        const individu = pesertaInstansi.filter((p) => p.kategori === "Individu");
                        const kelompok = pesertaInstansi.filter((p) => p.kategori === "Kelompok");

                        return (
                            <div className="container-instansi" key={instansi}>
                                <div className="instansi-header">
                                    <LuAlignJustify
                                        size={25}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => toggleInstansi(instansi)}
                                    />
                                    <div className="teks-instansi">
                                        <p>Instansi</p>
                                        <p>{instansi}</p>
                                    </div>
                                </div>

                                <div
                                    className={`contain-table-wrapper ${
                                        openInstansi[instansi] ? "open" : "closed"
                                    } ${!openInstansi[instansi] ? "with-gap" : ""}`}
                                >
                                    <div className="contain-table">
                                        {/* TABEL INDIVIDU */}
                                        {individu.length > 0 && (
                                            <>
                                            <h4>Individu</h4>
                                            <div className="table-wrapper">
                                                <table>
                                                <thead>
                                                    <tr>
                                                    <th>No</th>
                                                    <th>Nama</th>
                                                    <th>Instansi</th>
                                                    <th>Tanggal Mulai Magang</th>
                                                    <th>Tanggal Selesai Magang</th>
                                                    <th>Kategori</th>
                                                    <th>Status</th>
                                                    <th>Upload Surat Penerimaan</th>
                                                    <th>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {individu.map((peserta, idx) => (
                                                    <tr key={peserta.id}>
                                                        <td>{idx + 1}</td>
                                                        <td className="nama-cell">
                                                        <img src={peserta.profil} alt="Foto Profil" />
                                                        <span>{peserta.nama}</span>
                                                        </td>
                                                        <td>{peserta.instansi}</td>
                                                        <td>{peserta.tglMulai}</td>
                                                        <td>{peserta.tglSelesai}</td>
                                                        <td>{peserta.kategori}</td>
                                                        <td>
                                                            <span className="status-label diterima">{peserta.status}</span>
                                                        </td>
                                                        <td>
                                                            <div className="upload-container">
                                                                <input 
                                                                    type="file" 
                                                                    id={`file-${peserta.id}`} 
                                                                    onChange={(e) => handleFileChange(peserta.id, e)} 
                                                                />
                                                                <label htmlFor={`file-${peserta.id}`}>
                                                                    {fileUploads[peserta.id] ? fileUploads[peserta.id].name : "Upload File"}
                                                                </label>
                                                                <button onClick={() => handleUpload(peserta.id)}>Upload</button>
                                                            </div>
                                                        </td>
                                                        <td className="aksi-cell">
                                                            <div className="aksi-wrapper">
                                                            <FaEllipsisVertical style={{ cursor: "pointer" }} title="Detail Profil" onClick={() => handleOpenModal(peserta)} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                                </table>
                                            </div>
                                            </>
                                        )}

                                        {/* TABEL KELOMPOK */}
                                        {kelompok.length > 0 && (
                                            <>
                                            <h4>Kelompok</h4>
                                            <div className="table-wrapper">
                                                <table>
                                                <thead>
                                                    <tr>
                                                    <th>No</th>
                                                    <th>Nama</th>
                                                    <th>Instansi</th>
                                                    <th>Tanggal Mulai Magang</th>
                                                    <th>Tanggal Selesai Magang</th>
                                                    <th>Kategori</th>
                                                    <th>Status</th>
                                                    <th>Upload Surat Penerimaan</th>
                                                    <th>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {kelompok.map((peserta, idx) => (
                                                    <tr key={peserta.id}>
                                                        <td>{idx + 1}</td>
                                                        <td className="nama-cell">
                                                        <img src={peserta.profil} alt="Foto Profil" />
                                                        <span>{peserta.nama}</span>
                                                        </td>
                                                        <td>{peserta.instansi}</td>
                                                        <td>{peserta.tglMulai}</td>
                                                        <td>{peserta.tglSelesai}</td>
                                                        <td>{peserta.kategori}</td>
                                                        <td>
                                                            <span className="status-label diterima">{peserta.status}</span>
                                                        </td>
                                                        <td>
                                                            <div className="upload-container">
                                                                <input 
                                                                    type="file" 
                                                                    id={`file-${peserta.id}`} 
                                                                    onChange={(e) => handleFileChange(peserta.id, e)} 
                                                                />
                                                                <label htmlFor={`file-${peserta.id}`}>
                                                                    {fileUploads[peserta.id] ? fileUploads[peserta.id].name : "Upload File"}
                                                                </label>
                                                                <button onClick={() => handleUpload(peserta.id)}>Upload</button>
                                                            </div>
                                                        </td>
                                                        <td className="aksi-cell">
                                                            <div className="aksi-wrapper">
                                                            <FaEllipsisVertical style={{ cursor: "pointer" }} title="Detail Profil" onClick={() => handleOpenModal(peserta)} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                                </table>
                                            </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* MODAL DETAIL PESERTA */}
                {showModal && selectedPeserta && (
                    <div className="peserta-overlay" onClick={() => setShowModal(false)}>
                        <div className="peserta-modal" onClick={(e) => e.stopPropagation()}>
                            
                            {/* Header */}
                            <div className="peserta-modal-header">
                                <span>Detail Peserta {selectedPeserta.nama}</span>
                                <div className="peserta-close-btn" onClick={() => setShowModal(false)}>
                                    <FaTimes />
                                </div>
                            </div>

                            {/* Body */}
                            <div className="peserta-modal-body">

                                {/* Foto Profil + Tombol Edit/Save di samping */}
                                <div className="peserta-top-section">
                                    <div className="peserta-profile-pic">
                                        <img
                                            src={selectedPeserta.profil}
                                            alt="Profil"
                                            style={{ width: "90px", height: "90px", borderRadius: "10px" }}
                                        />
                                    </div>
                                    <div className="peserta-modal-actions-wide">
                                        {!selectedPeserta.isEditing ? (
                                            <button className="btn-edit" onClick={() => setSelectedPeserta({...selectedPeserta, isEditing: true})}>
                                                Edit Profil
                                            </button>
                                        ) : (
                                            <button className="btn-save" onClick={() => setSelectedPeserta({...selectedPeserta, isEditing: false})}>
                                                Simpan
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Input data peserta dua kolom */}
                                <div className="peserta-detail-grid">
                                    <div className="peserta-detail-item">
                                        <b>Nama :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.nama} disabled={!selectedPeserta.isEditing} onChange={(e) => setSelectedPeserta({...selectedPeserta, nama: e.target.value})} />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>NIM/NIP :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.nim} disabled={!selectedPeserta.isEditing} onChange={(e) => setSelectedPeserta({...selectedPeserta, nim: e.target.value})} />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>Instansi :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.instansi} disabled={!selectedPeserta.isEditing} onChange={(e) => setSelectedPeserta({...selectedPeserta, instansi: e.target.value})} />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>Email :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.email} disabled={!selectedPeserta.isEditing} onChange={(e) => setSelectedPeserta({...selectedPeserta, email: e.target.value})} />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>Password :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.password} disabled={!selectedPeserta.isEditing} onChange={(e) => setSelectedPeserta({...selectedPeserta, password: e.target.value})} />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>Tanggal Mulai - Selesai :</b>
                                        <input className="peserta-input" type="text" value={`${selectedPeserta.tglMulai} hingga ${selectedPeserta.tglSelesai}`} disabled />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>Kategori :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.kategori} disabled />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>Status :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.status || "Belum ada"} disabled />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>Status Upload Sertifikat:</b>{" "}
                                        {uploadedStatus[selectedPeserta.id] ? (
                                        <span className="status-label sukses">Sudah Upload</span>
                                        ) : (
                                        <span className="status-label gagal">Belum Upload</span>
                                        )}
                                    </div>
                                </div>

                                {/* Dokumen tetap */}
                                <div className="peserta-detail-item">
                                    <b>Dokumen :</b>
                                    <div className="dokumen-list">
                                        {selectedPeserta.dokumen.map((doc, index) => (
                                            <div className="dokumen-item" key={index}>
                                                <span>{doc}</span>
                                                <div className="dokumen-actions">
                                                    <button className="btn-view">View</button>
                                                    <button className="btn-download">Download</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Diterima;
