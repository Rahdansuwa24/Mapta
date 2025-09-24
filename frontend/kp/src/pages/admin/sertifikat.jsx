// PAGE SERTIFIKAT ADMIN

import React, { useEffect, useState } from "react";
import SidebarAdmSf from "../../components/sidebar-adm";
import NavbarAdmSf from "../../components/navbar-adm";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

import "../../styles/dashboard.css";

import profil1 from "../../assets/images/profil1.jpg";
import profil2 from "../../assets/images/profil2.jpeg";

function Sertifikat() {
    useEffect(() => {
        document.title = "Admin MAPTA";
    }, []);

    const pesertaDummy = [
    {
        id: 1,
        nama: "Budi Santoso",
        nim: "1234567890",
        instansi: "Politeknik Elektronika Negeri Surabaya",
        tglMulai: "01-09-2025",
        tglSelesai: "30-11-2025",
        status: "Selesai",
        profil: profil1,
        nilaiTeknis: [
        { aspek: "Kehadiran", skor: 90, huruf: "A" },
        { aspek: "Skill/Keahlian", skor: 85, huruf: "B+" },
        { aspek: "Kreatifitas", skor: 88, huruf: "B+" },
        ],
        nilaiNonTeknis: [
        { aspek: "Kerjasama", skor: 92, huruf: "A-" },
        { aspek: "Komunikasi", skor: 87, huruf: "B+" },
        { aspek: "Sikap/Etika", skor: 95, huruf: "A" },
        ],
    },
    {
        id: 2,
        nama: "Siti Aisyah",
        nim: "9876543210",
        instansi: "Politeknik Elektronika Negeri Surabaya",
        tglMulai: "01-09-2025",
        tglSelesai: "30-11-2025",
        status: "Selesai",
        profil: profil2,
        nilaiTeknis: [
        { aspek: "Kehadiran", skor: 95, huruf: "A" },
        { aspek: "Skill/Keahlian", skor: 90, huruf: "A-" },
        { aspek: "Kreatifitas", skor: 93, huruf: "A" },
        ],
        nilaiNonTeknis: [
        { aspek: "Kerjasama", skor: 96, huruf: "A" },
        { aspek: "Komunikasi", skor: 89, huruf: "B+" },
        { aspek: "Sikap/Etika", skor: 94, huruf: "A" },
        ],
    },
    {
        id: 3,
        nama: "Andi Wijaya",
        nim: "1122334455",
        instansi: "Politeknik Elektronika Negeri Surabaya",
        tglMulai: "01-09-2025",
        tglSelesai: "30-11-2025",
        status: "Selesai",
        profil: profil1,
        nilaiTeknis: [
        { aspek: "Kehadiran", skor: 88, huruf: "B+" },
        { aspek: "Skill/Keahlian", skor: 92, huruf: "A-" },
        { aspek: "Kreatifitas", skor: 85, huruf: "B+" },
        ],
        nilaiNonTeknis: [
        { aspek: "Kerjasama", skor: 90, huruf: "A-" },
        { aspek: "Komunikasi", skor: 86, huruf: "B+" },
        { aspek: "Sikap/Etika", skor: 91, huruf: "A-" },
        ],
    },
    {
        id: 4,
        nama: "Dewi Lestari",
        nim: "5566778899",
        instansi: "Politeknik Elektronika Negeri Surabaya",
        tglMulai: "01-09-2025",
        tglSelesai: "30-11-2025",
        status: "Selesai",
        profil: profil2,
        nilaiTeknis: [
        { aspek: "Kehadiran", skor: 93, huruf: "A" },
        { aspek: "Skill/Keahlian", skor: 87, huruf: "B+" },
        { aspek: "Kreatifitas", skor: 90, huruf: "A-" },
        ],
        nilaiNonTeknis: [
        { aspek: "Kerjasama", skor: 92, huruf: "A-" },
        { aspek: "Komunikasi", skor: 88, huruf: "B+" },
        { aspek: "Sikap/Etika", skor: 94, huruf: "A" },
        ],
    },
    {
        id: 5,
        nama: "Rizky Pratama",
        nim: "6677889900",
        instansi: "Politeknik Elektronika Negeri Surabaya",
        tglMulai: "01-09-2025",
        tglSelesai: "30-11-2025",
        status: "Selesai",
        profil: profil1,
        nilaiTeknis: [
        { aspek: "Kehadiran", skor: 85, huruf: "B+" },
        { aspek: "Skill/Keahlian", skor: 89, huruf: "B+" },
        { aspek: "Kreatifitas", skor: 87, huruf: "B+" },
        ],
        nilaiNonTeknis: [
        { aspek: "Kerjasama", skor: 90, huruf: "A-" },
        { aspek: "Komunikasi", skor: 84, huruf: "B" },
        { aspek: "Sikap/Etika", skor: 89, huruf: "B+" },
        ],
    },
    {
        id: 6,
        nama: "Nurul Hidayah",
        nim: "7788990011",
        instansi: "Politeknik Elektronika Negeri Surabaya",
        tglMulai: "01-09-2025",
        tglSelesai: "30-11-2025",
        status: "Selesai",
        profil: profil2,
        nilaiTeknis: [
        { aspek: "Kehadiran", skor: 97, huruf: "A" },
        { aspek: "Skill/Keahlian", skor: 91, huruf: "A-" },
        { aspek: "Kreatifitas", skor: 94, huruf: "A" },
        ],
        nilaiNonTeknis: [
        { aspek: "Kerjasama", skor: 95, huruf: "A" },
        { aspek: "Komunikasi", skor: 92, huruf: "A-" },
        { aspek: "Sikap/Etika", skor: 96, huruf: "A" },
        ],
    },
    ];


    const [fileUploads, setFileUploads] = useState({});
    const [uploadedStatus, setUploadedStatus] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showNilai, setShowNilai] = useState(false);
    const [selectedPeserta, setSelectedPeserta] = useState(null);

    const handleFileChange = (pesertaId, e) => {
        setFileUploads({
        ...fileUploads,
        [pesertaId]: e.target.files[0],
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

    const handleDownload = (peserta) => {
        alert(`Download sertifikat untuk ${peserta.nama}`);
    };

    const handleOpenModal = (peserta) => {
        setSelectedPeserta(peserta);
        setShowModal(true);
    };

    const handleOpenNilai = (peserta) => {
        setSelectedPeserta(peserta);
        setShowNilai(true);
    };

    return (
        <div className="app-layout">
        <SidebarAdmSf />
        <div className="content-area">
            <NavbarAdmSf />

            <section className="main">
            <div className="submain">
                <p className="judul-submain">Daftar Sertifikat Peserta Magang</p>
            </div>

            <div className="table-wrapper">
                <table>
                <thead>
                    <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Instansi</th>
                    <th>Tanggal Mulai Magang</th>
                    <th>Tanggal Selesai Magang</th>
                    <th>Status Magang</th>
                    <th>Download Sertifikat</th>
                    <th>Upload Sertifikat</th>
                    <th>Detail Nilai</th>
                    <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {pesertaDummy.map((peserta, idx) => (
                    <tr key={peserta.id}>
                        <td>{idx + 1}</td>
                        <td className="nama-cell">
                        <img src={peserta.profil} alt="Foto Profil" />
                        <span>{peserta.nama}</span>
                        </td>
                        <td>{peserta.instansi}</td>
                        <td>{peserta.tglMulai}</td>
                        <td>{peserta.tglSelesai}</td>
                        <td>
                        <span className="status-label selesai">
                            {peserta.status}
                        </span>
                        </td>

                        {/* Download Sertifikat */}
                        <td>
                        <span
                            className="label-action download"
                            onClick={() => handleDownload(peserta)}
                        >
                            Download
                        </span>
                        </td>

                        {/* Upload Sertifikat */}
                        <td>
                        <div className="upload-container">
                            <input
                            type="file"
                            id={`file-${peserta.id}`}
                            onChange={(e) => handleFileChange(peserta.id, e)}
                            />
                            <label htmlFor={`file-${peserta.id}`}>
                            {fileUploads[peserta.id]
                                ? fileUploads[peserta.id].name
                                : "Upload File"}
                            </label>
                            <button onClick={() => handleUpload(peserta.id)}>
                            Upload
                            </button>
                        </div>
                        </td>

                        {/* Detail Nilai */}
                        <td>
                        <span
                            className="label-action nilai"
                            onClick={() => handleOpenNilai(peserta)}
                        >
                            Lihat Nilai
                        </span>
                        </td>

                        {/* Aksi */}
                        <td className="aksi-cell">
                        <FaEllipsisVertical
                            style={{ cursor: "pointer" }}
                            title="Detail Profil"
                            onClick={() => handleOpenModal(peserta)}
                        />
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </section>

            {/* MODAL DETAIL PESERTA */}
            {showModal && selectedPeserta && (
            <div className="peserta-overlay" onClick={() => setShowModal(false)}>
                <div
                className="peserta-modal"
                onClick={(e) => e.stopPropagation()}
                >
                <div className="peserta-modal-header">
                    <span>Detail Peserta {selectedPeserta.nama}</span>
                    <div
                    className="peserta-close-btn"
                    onClick={() => setShowModal(false)}
                    >
                    <FaTimes />
                    </div>
                </div>

                <div className="peserta-modal-body">
                    <div className="peserta-detail-grid">
                    <div className="peserta-detail-item">
                        <b>Nama :</b> {selectedPeserta.nama}
                    </div>
                    <div className="peserta-detail-item">
                        <b>NIM/NIP :</b> {selectedPeserta.nim}
                    </div>
                    <div className="peserta-detail-item">
                        <b>Instansi :</b> {selectedPeserta.instansi}
                    </div>
                    <div className="peserta-detail-item">
                        <b>Tanggal :</b>{" "}
                        {selectedPeserta.tglMulai} - {selectedPeserta.tglSelesai}
                    </div>
                    <div className="peserta-detail-item">
                        <b>Status Magang :</b> {selectedPeserta.status}
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
                </div>
                </div>
            </div>
            )}

            {/* MODAL DETAIL NILAI */}
            {showNilai && selectedPeserta && (
            <div className="nilai-overlay" onClick={() => setShowNilai(false)}>
                <div className="nilai-modal" onClick={(e) => e.stopPropagation()}>
                <div className="nilai-modal-header">
                    <span>Detail Nilai Peserta {selectedPeserta.nama}</span>
                    <div className="nilai-close-btn" onClick={() => setShowNilai(false)}>
                    <FaTimes />
                    </div>
                </div>

                <div className="nilai-modal-body">
                    {/* ASPEK TEKNIS */}
                    <div className="nilai-section">
                    <h4>Aspek Teknis</h4>
                    <table className="nilai-table">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Aspek Yang Dinilai</th>
                            <th>Nilai Angka</th>
                            <th>Nilai Huruf</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedPeserta.nilaiTeknis.map((item, i) => (
                            <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item.aspek}</td>
                            <td>{item.skor}</td>
                            <td>{item.huruf}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>

                    {/* ASPEK NON TEKNIS */}
                    <div className="nilai-section">
                    <h4>Aspek Non Teknis</h4>
                    <table className="nilai-table">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Aspek Yang Dinilai</th>
                            <th>Nilai Angka</th>
                            <th>Nilai Huruf</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedPeserta.nilaiNonTeknis.map((item, i) => (
                            <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item.aspek}</td>
                            <td>{item.skor}</td>
                            <td>{item.huruf}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    );
}

export default Sertifikat;
