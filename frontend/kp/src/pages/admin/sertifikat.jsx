// PAGE SERTIFIKAT ADMIN

import React, { useEffect, useState } from "react";
import SidebarAdmSf from "../../components/sidebar-adm";
import NavbarAdmSf from "../../components/navbar-adm";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import axios from 'axios'
import { toast } from "react-toastify";
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

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
            toast.error("Gagal mengambil data peserta")

        }
    }
    

    const [searchTerm, setSearchTerm] = useState("");

    const [fileUploads, setFileUploads] = useState({});
    const [uploadedStatus, setUploadedStatus] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [dataPeserta, setDataPeserta] = useState([])
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState({});

    const handleFileChange = (pesertaId, e) => {
        const file = e.target.files[0];
        const allowedTypes = [
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Hanya boleh upload dalam format dokumen dan pdf");
            e.target.value = ""; 
            return;
        }
        setFileUploads({
        ...fileUploads,
        [pesertaId]: e.target.files[0],
        });
    };

    const handleUpload = async (pesertaId) => {
        const file = fileUploads[pesertaId];
        if (!file) {
            toast.error("Pilih file terlebih dahulu!");
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
            toast.success(`File "${file.name}" berhasil diupload untuk peserta`);
            fetchDataPesertaSelesai()
        }catch(error){
            console.error(error);
            toast.error("Upload gagal!");
        }
    };

    const handleDownload = (peserta) => {
        window.open(`http://localhost:3000/admin/sertifikat/download-sertifikat/${peserta.id_peserta_magang}`, "_blank");
    };

    const handleOpenModal = (peserta) => {
        setSelectedPeserta(peserta);
        setShowModal(true);
    };

    const filteredPeserta = dataPeserta.filter((p) =>
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.instansi.toLowerCase().includes(searchTerm.toLowerCase())
);

    return (
        <div className="app-layout">
        <SidebarAdmSf />
        <div className="content-area">
            <NavbarAdmSf onSearch={setSearchTerm}/>

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
                    <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPeserta.map((peserta, idx) => (
                    <tr key={peserta.id_peserta_magang}>
                        <td>{idx + 1}</td>
                        <td className="nama-cell">
                        <img src={`http://localhost:3000/static/images/${peserta.foto_diri}`} alt="Foto Profil" />
                        <span>{highlightText(peserta.nama, searchTerm)}</span>
                        </td>
                        <td>{highlightText(peserta.instansi, searchTerm)}</td>
                        <td>{dayjs(peserta.tanggal_mulai_magang).format("DD MMMM YYYY")}</td>
                        <td>{dayjs(peserta.tanggal_selesai_magang).format("DD MMMM YYYY")}</td>
                        <td>
                        <span className="status-label selesai">
                            {peserta.status_penerimaan}
                        </span>
                        </td>

                        <td>
                        <span
                            className="label-action download"
                            onClick={() => handleDownload(peserta)}
                        >
                            Download
                        </span>
                        </td>

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
                    {/* === Tombol Finalisasi ditambahkan di sini === */}
                    <div className="finalisasi-container">
                        <button className="btn-finalisasi">Finalisasi</button>
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
