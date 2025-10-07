// PAGE DITERIMA ADMIN

import React, { useEffect, useState } from "react";
import SidebarAdmTm from "../../components/sidebar-adm";
import NavbarAdmTm from "../../components/navbar-adm";
import { LuAlignJustify } from "react-icons/lu";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import axios from 'axios'
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

import "../../styles/dashboard.css";

import profil1 from "../../assets/images/profil1.jpg";
import profil2 from "../../assets/images/profil2.jpeg";

function Diterima() {
    useEffect(() => {
        document.title = "Admin MAPTA";
    }, []);

    const [PesertaDiterima, setPesertaDiterima] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(()=>{
        fetchPesertaDiterima()
    }, [])

    const fetchPesertaDiterima = async()=>{
        const token = localStorage.getItem("token")
        try{
            const res = await axios.get("http://localhost:3000/admin/dasbor/penerimaan", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            const dataPeserta = res.data.data
            console.log(res.data.data)
            setPesertaDiterima(dataPeserta)

            const statusMap = {}
            const filesMap = {}
            dataPeserta.forEach(p => {
                statusMap[p.id_peserta_magang] = !!p.surat_balasan;
                filesMap[p.id_peserta_magang] = p.surat_balasan || null;
            });
            setUploadedStatus(statusMap);
            setUploadedFiles(filesMap)
        }catch(error){
           setError("gagal mengambil data")
        }finally{
            setLoading(false)
        }
    }

    const [searchTerm, setSearchTerm] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [uploadedStatus, setUploadedStatus] = useState({});
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [filterInstansi, setFilterInstansi] = useState("");
    const [openInstansi, setOpenInstansi] = useState({});
    const [fileUploads, setFileUploads] = useState({});

    const [uploadedFiles, setUploadedFiles] = useState({});

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

    const handleUpload = async (pesertaId) => {
    const file = fileUploads[pesertaId];
    if (!file) {
        alert("Pilih file terlebih dahulu!");
        return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("surat_balasan", file);

    try {
        await axios.patch(
        `http://localhost:3000/admin/dasbor/update-surat-balasan/${pesertaId}`,
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
        alert(`File "${file.name}" berhasil diupload untuk peserta ID ${pesertaId}`);
        fetchPesertaDiterima()
    }catch (error) {
            console.error(error);
            alert("Upload gagal!");
        }
    };

    const handleSaveProfile = async()=>{
        const token = localStorage.getItem("token")
        try{
            await axios.patch( `http://localhost:3000/admin/dasbor/update/profile/${selectedPeserta.id_peserta_magang}`, {
                nama: selectedPeserta.nama,
                nomor_identitas: selectedPeserta.nomor_identitas, 
                instansi: selectedPeserta.instansi,
            },{
                headers: { Authorization: `Bearer ${token}` },
            })
            alert("Profil berhasil diperbarui!");
            setSelectedPeserta({ ...selectedPeserta, isEditing: false });
            fetchPesertaDiterima();
        }catch(error){
            console.error(error);
            alert("Gagal memperbarui profil!");
        }
    }

    // ini baru penggabungan
const filteredPeserta = PesertaDiterima.filter((p) => {
  const matchInstansi = filterInstansi ? p.instansi === filterInstansi : true;
  const nama = p.nama ? p.nama.toLowerCase() : "";
  const instansi = p.instansi ? p.instansi.toLowerCase() : "";
  const matchSearch =
    nama.includes(searchTerm.toLowerCase()) ||
    instansi.includes(searchTerm.toLowerCase());
  return matchInstansi && matchSearch;
});

    const instansiList = [
        ...new Set(PesertaDiterima.map((p) => p.instansi))
    ];

    // filteredpeserta dipanggil
    const pesertaPerInstansi = filteredPeserta.reduce((acc, peserta) => {
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
    }, [PesertaDiterima,filterInstansi]);

    return (
        <div className="app-layout">
            <SidebarAdmTm />
            <div className="content-area">
                <NavbarAdmTm onSearch={setSearchTerm} /> 

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
                        const individu = pesertaInstansi.filter((p) => p.kategori === "individu");
                        const kelompok = pesertaInstansi.filter((p) => p.kategori === "kelompok");
                        const kelompokByInstansi = kelompok.reduce((acc, p) => {
                            const key = `${p.instansi}-${p.id_kelompok}`;
                            if (!acc[key]) acc[key] = [];
                            acc[key].push(p);
                            return acc;
                        }, {});
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
                                                    <tr key={peserta.id_peserta_magang}>
                                                        <td>{idx + 1}</td>
                                                        <td className="nama-cell">
                                                        <img src={`http://localhost:3000/static/images/${peserta.foto_diri}`} alt="Foto Profil" />
                                                        <span>{peserta.nama}</span>
                                                        </td>
                                                        <td>{peserta.instansi}</td>
                                                        <td>{dayjs(peserta.tanggal_mulai_magang).format("DD MMMM YYYY")}</td>
                                                        <td>{dayjs(peserta.tanggal_selesai_magang).format("DD MMMM YYYY")}</td>
                                                        <td>{peserta.kategori}</td>
                                                        <td>
                                                            <span className="status-label diterima">{peserta.status_penerimaan}</span>
                                                        </td>
                                                        <td>
                                                            <div className="upload-container">
                                                                <input 
                                                                    type="file" 
                                                                    id={`file-${peserta.id_peserta_magang}`} 
                                                                    onChange={(e) => handleFileChange(peserta.id_peserta_magang, e)} 
                                                                />
                                                                <label htmlFor={`file-${peserta.id_peserta_magang}`}>
                                                                    {fileUploads[peserta.id_peserta_magang] ? fileUploads[peserta.id_peserta_magang].name : "Upload File"}
                                                                </label>
                                                                <button onClick={() => handleUpload(peserta.id_peserta_magang)}>Upload</button>
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
                                        {Object.keys(kelompokByInstansi).map((kelKey, idx) => (
                                        <div key={kelKey}>
                                            <h4>Kelompok {idx + 1} ({kelompokByInstansi[kelKey][0].instansi})</h4>
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
                                                {kelompokByInstansi[kelKey].map((peserta, i) => (
                                                    <tr key={peserta.id_peserta_magang}>
                                                    <td>{i + 1}</td>
                                                    <td className="nama-cell">
                                                        <img
                                                        src={`http://localhost:3000/static/images/${peserta.foto_diri}`}
                                                        alt="Foto Profil"
                                                        />
                                                        <span>{peserta.nama}</span>
                                                    </td>
                                                    <td>{peserta.instansi}</td>
                                                    <td>{dayjs(peserta.tanggal_mulai_magang).format("DD MMMM YYYY")}</td>
                                                    <td>{dayjs(peserta.tanggal_selesai_magang).format("DD MMMM YYYY")}</td>
                                                    <td>{peserta.kategori}</td>
                                                    <td>
                                                        <span className="status-label diterima">{peserta.status_penerimaan}</span>
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
                                                        <button onClick={() => handleUpload(peserta.id_peserta_magang)}>Upload</button>
                                                        </div>
                                                    </td>
                                                    <td className="aksi-cell">
                                                        <div className="aksi-wrapper">
                                                        <FaEllipsisVertical
                                                            style={{ cursor: "pointer" }}
                                                            title="Detail Profil"
                                                            onClick={() => handleOpenModal(peserta)}
                                                        />
                                                        </div>
                                                    </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>
                                        ))}
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
                                            src={`http://localhost:3000/static/images/${selectedPeserta.foto_diri}`}
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
                                            <button className="btn-save" onClick={handleSaveProfile}>
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
                                        <input className="peserta-input" type="text" value={selectedPeserta.nomor_identitas} disabled={!selectedPeserta.isEditing} onChange={(e) => setSelectedPeserta({...selectedPeserta, nomor_identitas: e.target.value})} />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>Instansi :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.instansi} disabled={!selectedPeserta.isEditing} onChange={(e) => setSelectedPeserta({...selectedPeserta, instansi: e.target.value})} />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>Email :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.email} disabled/>
                                    </div>

                                    {/* <div className="peserta-detail-item">
                                        <b>Password :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.password} disabled={!selectedPeserta.isEditing} onChange={(e) => setSelectedPeserta({...selectedPeserta, password: e.target.value})} />
                                    </div> */}

                                    <div className="peserta-detail-item">
                                        <b>Tanggal Mulai - Selesai :</b>
                                        <input className="peserta-input" type="text" value={`${dayjs(selectedPeserta.tanggal_mulai_magang).format("DD MMMM YYYY")} hingga ${dayjs(selectedPeserta.tanggal_selesai_magang).format("DD MMMM YYYY")}`}  disabled />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>Kategori :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.kategori} disabled />
                                    </div>

                                    <div className="peserta-detail-item">
                                        <b>Status :</b>
                                        <input className="peserta-input" type="text" value={selectedPeserta.status_penerimaan || "Belum ada"} disabled />
                                    </div>
                                    <div className="peserta-detail-item">
                                        <b>Status Upload Surat Balasan:</b>{" "}
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
                                {/* Dokumen tetap */}
                                <div className="peserta-detail-item">
                                    <b>Dokumen :</b>
                                     <div className="dokumen-list">
                                       {selectedPeserta.dokumen_pendukung &&
                                        JSON.parse(selectedPeserta.dokumen_pendukung).map((doc, index)=> (
                                            <div className="dokumen-item" key={doc}>
                                                <span>{doc}</span>
                                                <div className="dokumen-actions">
                                                    <button className="btn-download" onClick={()=>{
                                                        window.open(`http://localhost:3000/static/document/${doc}`,"_blank", "noopener,noreferrer")
                                                    }}>Download</button>
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
