// PAGE SERTIFIKAT ADMIN

import React, { useEffect, useState } from "react";
import SidebarAdmSf from "../../components/sidebar-adm";
import NavbarAdmSf from "../../components/navbar-adm";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import axios from 'axios'
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

import "../../styles/dashboard.css";

import profil1 from "../../assets/images/profil1.jpg";
import profil2 from "../../assets/images/profil2.jpeg";

function Sertifikat() {
    useEffect(() => {
        document.title = "Admin MAPTA";
        fetchDataPesertaSelesai()
    }, []);

    const fetchDataPesertaSelesai = async()=>{
        const token = localStorage.getItem("token")
        try{
            const res = await axios.get("http://localhost:3000/admin/sertifikat", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            const dataPesertaSelesai = res.data.data
            setDataPeserta(dataPesertaSelesai)

            const statusMap = {}
            const filesMap = {}
            dataPesertaSelesai.forEach(p => {
                statusMap[p.id_peserta_magang] = !!p.sertifikat;
                filesMap[p.id_peserta_magang] = p.sertifikat || null;
            });
            setUploadedStatus(statusMap);
            setUploadedFiles(filesMap)
        }catch(error){
            console.error(error)
            alert("Gagal Fetch Data")

        }
    }
    
    const [fileUploads, setFileUploads] = useState({});
    const [uploadedStatus, setUploadedStatus] = useState({});
    const [showModal, setShowModal] = useState(false);
    // const [showNilai, setShowNilai] = useState(false);
    const [dataPeserta, setDataPeserta] = useState([])
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState({});

    const handleFileChange = (pesertaId, e) => {
        setFileUploads({
        ...fileUploads,
        [pesertaId]: e.target.files[0],
        });
    };

    const handleUpload = async (pesertaId) => {
        const file = fileUploads[pesertaId];
        if (!file) {
            alert("Pilih file terlebih dahulu!");
            return;
        }
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("sertifikat", file);
        
        try{
            await axios.patch(
            `http://localhost:3000/admin/sertifikat/update-sertifikat/${pesertaId}`,
            formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setUploadedStatus(prev=>({ ...prev, [pesertaId]: true }));
            setUploadedFiles((prev) => ({ ...prev, [pesertaId]: file.name }));
            setFileUploads(prev=>({ ...prev, [pesertaId]: null }));
            alert(`File "${file.name}" berhasil diupload untuk peserta`);
            fetchDataPesertaSelesai()
        }catch(error){
            console.error(error);
            alert("Upload gagal!");
        }
    };

    const handleDownload = (peserta) => {
         window.open(`http://localhost:3000/admin/sertifikat/download-sertifikat/${peserta.id_peserta_magang}`, "_blank");
    };

    const handleOpenModal = (peserta) => {
        setSelectedPeserta(peserta);
        setShowModal(true);
    };

    // const handleOpenNilai = (peserta) => {
    //     setSelectedPeserta(peserta);
    //     setShowNilai(true);
    // };

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
                    {/* <th>Detail Nilai</th> */}
                    <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {dataPeserta.map((peserta, idx) => (
                    <tr key={peserta.id_peserta_magang}>
                        <td>{idx + 1}</td>
                        <td className="nama-cell">
                        <img src={`http://localhost:3000/static/images/${peserta.foto_diri}`} alt="Foto Profil" />
                        <span>{peserta.nama}</span>
                        </td>
                        <td>{peserta.instansi}</td>
                        <td>{dayjs(peserta.tanggal_mulai_magang).format("DD MMMM YYYY")}</td>
                        <td>{dayjs(peserta.tanggal_selesai_magang).format("DD MMMM YYYY")}</td>
                        <td>
                        <span className="status-label selesai">
                            {peserta.status_penerimaan}
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
                            id={`file-${peserta.id_peserta_magang}`}
                            onChange={(e) => handleFileChange(peserta.id_peserta_magang, e)}
                            />
                            <label htmlFor={`file-${peserta.id_peserta_magang}`}>
                            {fileUploads[peserta.id_peserta_magang]
                                ? fileUploads[peserta.id_peserta_magang].name
                                : "Upload File"}
                            </label>
                            <button onClick={() => handleUpload(peserta.id_peserta_magang)}>
                            Upload
                            </button>
                        </div>
                        </td>

                        {/* Detail Nilai */}
                        {/* <td>
                        <span
                            className="label-action nilai"
                            onClick={() => handleOpenNilai(peserta)}
                        >
                            Lihat Nilai
                        </span>
                        </td> */}

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
                        <b>NIM/NIP :</b> {selectedPeserta.nomor_identitas}
                    </div>
                    <div className="peserta-detail-item">
                        <b>Instansi :</b> {selectedPeserta.instansi}
                    </div>
                    <div className="peserta-detail-item">
                        <b>Tanggal :</b>{" "}
                        {dayjs(selectedPeserta.tanggal_mulai_magang).format("DD MMMM YYYY")} - {dayjs(selectedPeserta.tanggal_selesai_magang).format("DD MMMM YYYY")}
                    </div>
                    <div className="peserta-detail-item">
                        <b>Status Magang :</b> {selectedPeserta.status_penerimaan}
                    </div>
                    <div className="peserta-detail-item">
                        <b>Status Upload Sertifikat:</b>{" "}
                        {uploadedStatus[selectedPeserta.id_peserta_magang] ? (
                        <>
                        <span className="status-label sukses">Sudah Upload</span>
                        {uploadedFiles[selectedPeserta.id_peserta_magang] && (
                            <span className="file-name"> &nbsp;({uploadedFiles[selectedPeserta.id_peserta_magang]})</span>
                        )}
                        </>
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
            {/* {showNilai && selectedPeserta && (
            <div className="nilai-overlay" onClick={() => setShowNilai(false)}>
                <div className="nilai-modal" onClick={(e) => e.stopPropagation()}>
                <div className="nilai-modal-header">
                    <span>Detail Nilai Peserta {selectedPeserta.nama}</span>
                    <div className="nilai-close-btn" onClick={() => setShowNilai(false)}>
                    <FaTimes />
                    </div>
                </div> */}

                {/* <div className="nilai-modal-body"> */}
                    {/* ASPEK TEKNIS */}
                    {/* <div className="nilai-section">
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
                    </div> */}

                    {/* ASPEK NON TEKNIS */}
                    {/* <div className="nilai-section">
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
            )} */}
        </div>
        </div>
    );
}

export default Sertifikat;
