// PAGE DASHBOARD ADMIN

import React, { useEffect, useState } from "react";
import SidebarAdm from "../../components/sidebar-adm";
import NavbarAdm from "../../components/navbar-adm";
import { LuAlignJustify } from "react-icons/lu";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import axios from 'axios'
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');
import "../../styles/dashboard.css";

function Dashboard() {
    useEffect(() => {
        document.title = "Admin MAPTA";
    }, []);

    const [calonPeserta, setCalonPeserta] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [filterInstansi, setFilterInstansi] = useState("");
    const [openInstansi, setOpenInstansi] = useState({}); 
    const [showKuotaModal, setShowKuotaModal] = useState(false);
    const [kuota, setKuota] = useState(null);
    
    useEffect(()=>{
        fetchPeserta()
        getKuota()
    }, [])   


    const fetchPeserta = async() =>{
            const token = localStorage.getItem("token");
            try{
                const res = await axios.get("http://localhost:3000/admin/dasbor",{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setCalonPeserta(res.data.data)
            }catch(error){
                setError("gagal mengambil data")
                
            }finally{
                setLoading(false)
            }
    }
    const getKuota = async() =>{
            const token = localStorage.getItem("token");
            try{
                const res = await axios.get("http://localhost:3000/admin/dasbor/max-peserta",{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setKuota(res.data.total)
            }catch(error){
                setError("gagal mengambil data")
                
            }finally{
                setLoading(false)
            }
    }

    const [searchTerm, setSearchTerm] = useState("");

    const handleOpenModal = (peserta) => {
        setSelectedPeserta(peserta);
        setShowModal(true);
    };

    const highlightText = (text, search) => {
        if (!search) return text;
        const parts = text.split(new RegExp(`(${search})`, "gi"));
        return parts.map((part, i) =>
        part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} style={{ backgroundColor: "#AFD3F6" }}>
            {part}
            </mark>
        ) : (
            part
        )
        );
    };

    const pesertaFiltered = calonPeserta.filter((p) => {
    const matchInstansi = filterInstansi ? p.instansi === filterInstansi : true;
    const query = searchTerm.toLowerCase().trim();
    if (!query) return matchInstansi;

    const nama = p.nama?.toLowerCase() || "";
    const instansi = p.instansi?.toLowerCase() || "";
    const tanggalMulai = dayjs(p.tanggal_mulai_magang).format("YYYY-MM-DD");
    const tanggalSelesai = dayjs(p.tanggal_selesai_magang).format("YYYY-MM-DD");

    const matchSearch =
        nama.includes(query) ||
        instansi.includes(query) ||
        tanggalMulai.includes(query) ||
        tanggalSelesai.includes(query) ||
        dayjs(p.tanggal_mulai_magang).format("DD MMMM YYYY").toLowerCase().includes(query) ||
        dayjs(p.tanggal_selesai_magang).format("DD MMMM YYYY").toLowerCase().includes(query);

    return matchInstansi && matchSearch;
    });


    const instansiList = [
    ...new Set(calonPeserta.map((p) => p.instansi))
    ];

    // mengelompokan peserta berdasarkan instansi
    const pesertaPerInstansi = pesertaFiltered.reduce((acc, peserta) => {
        if (!acc[peserta.instansi]) acc[peserta.instansi] = [];
        acc[peserta.instansi].push(peserta);
        return acc;
    }, {});

    // fungsi toggle
        const toggleInstansi = (instansi) => {
        setOpenInstansi((prev) => ({
        ...prev,
        [instansi]: !prev[instansi], // ubah true <-> false
    }));
    };

    useEffect(() => {
        const initialState = {};
        Object.keys(pesertaPerInstansi).forEach(instansi => {
            initialState[instansi] = true;
        });
        setOpenInstansi(initialState);
    }, [calonPeserta, filterInstansi]);

    const incrementKuota = () => setKuota((prev) => prev + 1);
    const decrementKuota = () => setKuota((prev) => (prev > 0 ? prev - 1 : 0));
    const handleInputKuota = (e) => setKuota(Number(e.target.value));

    const handleNewNotif = (notif) => {
        console.log("Notifikasi baru diterima:", notif);
        fetchPeserta();
    };
    const handleSaveKuota = async() => {
        const token = localStorage.getItem("token")
        try{
            await axios.patch("http://localhost:3000/admin/dasbor/update-max-peserta", {
                total: kuota
            }, {
                headers: { Authorization: `Bearer ${token}` },
            }
        )
            alert("Nilai kuota disimpan: " + kuota);
            setShowKuotaModal(false);
        }catch(error){
            console.log(error)
            alert("gagal memperbarui data")
        }
    };

    return (
        <div className="app-layout">
            <SidebarAdm />
            <div className="content-area">
                <NavbarAdm onSearch={setSearchTerm} onNewNotif={handleNewNotif}/>

                <section className="main">
                    <div className="submain">
                        <p className="judul-submain">Peserta Magang yang Mendaftar</p>

                        <button
                            className="btn-kuota"
                            onClick={() => setShowKuotaModal(true)}
                            >
                            Ubah Kuota Magang
                        </button>

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


                {pesertaFiltered.length === 0 ? (
                <div className="no-data">
                    <p>Belum ada peserta magang yang mendaftar</p>
                </div>
                ) : (
                Object.keys(pesertaPerInstansi).map((instansi) => {
                    const pesertaInstansi = pesertaPerInstansi[instansi];
                    const individu = pesertaInstansi.filter((p) => p.kategori === "individu");
                    const kelompok = pesertaInstansi.filter((p) => p.kategori === "kelompok");

                    return (
                    <div className="container-instansi" key={instansi}>
                        <div className="instansi-header">
                        <LuAlignJustify
                            size={25}
                            style={{ cursor: "pointer" }}
                            onClick={() => toggleInstansi(instansi)}
                        />
                        <div className="teks-instansi">
                            <p>{instansi}</p>
                        </div>
                        </div>

                        <div
                        className={`contain-table-wrapper ${
                            openInstansi[instansi] ? "open" : "closed"
                        } ${!openInstansi[instansi] ? "with-gap" : ""}`}
                        >
                        <div className="contain-table">

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
                                        <th>Aksi</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {individu.map((peserta, idx) => (
                                        <tr key={peserta.id_peserta_magang}>
                                        <td>{idx + 1}</td>
                                        <td className="nama-cell">
                                            <img
                                            src={`http://localhost:3000/static/images/${peserta.foto_diri}`}
                                            alt="Foto Profil"
                                            />
                                            <span>{highlightText(peserta.nama, searchTerm)}</span>
                                        </td>
                                        <td>{highlightText(peserta.instansi, searchTerm)}</td>
                                        <td>
                                            {dayjs(peserta.tanggal_mulai_magang).format(
                                            "DD MMMM YYYY"
                                            )}
                                        </td>
                                        <td>
                                            {dayjs(peserta.tanggal_selesai_magang).format(
                                            "DD MMMM YYYY"
                                            )}
                                        </td>
                                        <td>{peserta.kategori}</td>
                                        <td className="aksi-cell">
                                            <div className="aksi-wrapper">
                                            <button
                                                style={{ color: "green", cursor: "pointer" }}
                                                title="Setujui"
                                                onClick={async () => {
                                                console.log(
                                                    "ID peserta:",
                                                    peserta.id_peserta_magang
                                                );
                                                const token = localStorage.getItem("token");
                                                try {
                                                    await axios.patch(
                                                    `http://localhost:3000/admin/dasbor/update/${peserta.id_peserta_magang}`,
                                                    { status_penerimaan: "diterima" },
                                                    {
                                                        headers: {
                                                        Authorization: `Bearer ${token}`,
                                                        },
                                                    }
                                                    );
                                                    alert("Lamaran disetujui");
                                                    fetchPeserta();
                                                } catch (err) {
                                                    console.error(err);
                                                }
                                                }}
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                style={{ color: "red", cursor: "pointer" }}
                                                title="Tolak"
                                                onClick={async () => {
                                                console.log(
                                                    "ID peserta:",
                                                    peserta.id_peserta_magang
                                                );
                                                const token = localStorage.getItem("token");
                                                try {
                                                    await axios.patch(
                                                    `http://localhost:3000/admin/dasbor/update/${peserta.id_peserta_magang}`,
                                                    { status_penerimaan: "ditolak" },
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                    }
                                                    );
                                                    alert("Lamaran ditolak");
                                                    fetchPeserta();
                                                } catch (err) {
                                                    console.error(err);
                                                }
                                                }}
                                            >
                                                <FaTimes />
                                            </button>
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
                            </>
                            )}

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
                                        <th>Aksi</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {kelompok.map((peserta, idx) => (
                                        <tr key={peserta.id_peserta_magang}>
                                        <td>{idx + 1}</td>
                                        <td className="nama-cell">
                                            <img
                                            src={`http://localhost:3000/static/images/${peserta.foto_diri}`}
                                            alt="Foto Profil"
                                            />
                                            <span>{highlightText(peserta.nama, searchTerm)}</span>
                                        </td>
                                        <td>{highlightText(peserta.instansi, searchTerm)}</td>
                                        <td>
                                            {dayjs(peserta.tanggal_mulai_magang).format(
                                            "DD MMMM YYYY"
                                            )}
                                        </td>
                                        <td>
                                            {dayjs(peserta.tanggal_selesai_magang).format(
                                            "DD MMMM YYYY"
                                            )}
                                        </td>
                                        <td>{peserta.kategori}</td>
                                        <td className="aksi-cell">
                                            <div className="aksi-wrapper">
                                            <button
                                                style={{ color: "green", cursor: "pointer" }}
                                                title="Setujui"
                                                onClick={async () => {
                                                console.log(
                                                    "ID peserta:",
                                                    peserta.id_peserta_magang
                                                );
                                                const token = localStorage.getItem("token");
                                                try {
                                                    await axios.patch(
                                                    `http://localhost:3000/admin/dasbor/update/${peserta.id_peserta_magang}`,
                                                    { status_penerimaan: "diterima" },
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                    }
                                                    );
                                                    alert("Lamaran disetujui");
                                                    fetchPeserta();
                                                } catch (err) {
                                                    console.error(err);
                                                }
                                                }}
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                style={{ color: "red", cursor: "pointer" }}
                                                title="Tolak"
                                                onClick={async () => {
                                                console.log(
                                                    "ID peserta:",
                                                    peserta.id_peserta_magang
                                                );
                                                const token = localStorage.getItem("token");
                                                try {
                                                    await axios.patch(
                                                    `http://localhost:3000/admin/dasbor/update/${peserta.id_peserta_magang}`,
                                                    { status_penerimaan: "ditolak" },
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                    }
                                                    );
                                                    alert("Lamaran ditolak");
                                                    fetchPeserta();
                                                } catch (err) {
                                                    console.error(err);
                                                }
                                                }}
                                            >
                                                <FaTimes />
                                            </button>
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
                            </>
                            )}
                        </div>
                        </div>
                    </div>
                    );
                })
                )}
                </section>

                {showModal && selectedPeserta && (
                    <div className="overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>Detail Peserta</span>
                                <div className="close-btn" onClick={() => setShowModal(false)}>
                                    <FaTimes />
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="profile-pic">
                                    <img
                                        src={`http://localhost:3000/static/images/${selectedPeserta.foto_diri}`}
                                        alt="Profil"
                                        style={{ width: "90px", height: "90px", borderRadius: "10px" }}
                                    />
                                </div>
                                <div className="detail-item">
                                    <b>Nama :</b>
                                    <p>{selectedPeserta.nama}</p>
                                </div>
                                <div className="detail-item">
                                    <b>NIM/NIP :</b>
                                    <p>{selectedPeserta.nomor_identitas}</p>
                                </div>
                                <div className="detail-item">
                                    <b>Instansi :</b>
                                    <p>{selectedPeserta.instansi}</p>
                                </div>
                                <div className="detail-item">
                                    <b>Tanggal Mulai - Tanggal Selesai :</b>
                                    <p>
                                        {dayjs(selectedPeserta.tanggal_mulai_magang).format("DD MMMM YYYY")} hingga {dayjs(selectedPeserta.tanggal_selesai_magang).format("DD MMMM YYYY")}
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <b>Kategori :</b>
                                    <p>{selectedPeserta.kategori}</p>
                                </div>
                                <div className="detail-item">
                                    <b>Email :</b>
                                    <p>{selectedPeserta.email}</p>
                                </div>

                                <div className="detail-item">
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

                {showKuotaModal && (
                <div className="kuota-overlay" onClick={() => setShowKuotaModal(false)}>
                    <div
                    className="input-group" 
                    onClick={(e) => e.stopPropagation()} 
                    >
                    <div className="kuota-header">
                        <button
                        className="kuota-close"
                        onClick={() => setShowKuotaModal(false)}
                        >
                        <FaTimes />
                        </button>
                    </div>

                        <span id="kuota-text">
                        Kuota Magang Saat Ini: {kuota} peserta
                        </span>

                        <div className="number-row">
                        <button className="tombol decrement" onClick={decrementKuota}>−</button>
                        <input
                            type="number"
                            value={kuota}
                            min="0"
                            id="kuota-input"
                            onChange={handleInputKuota}
                        />
                        <button className="tombol increment" onClick={incrementKuota}>+</button>
                        <button className="save-button" onClick={handleSaveKuota}>
                            Simpan
                        </button>
                        </div>

                        <div className="desc">
                        Silakan ubah jumlah peserta magang sesuai kebutuhan melalui kolom
                        input ini. Jika ingin menambah atau mengurangi jumlah peserta,
                        gunakan tombol +/− atau masukkan angka baru pada kolom input,
                        kemudian klik tombol Simpan untuk menyimpan perubahan.
                        <b> Pastikan angka yang dimasukkan sesuai dengan kuota yang diinginkan.</b>
                        </div>
                    </div>
                </div>
                )}

            </div>
        </div>
    );
}

export default Dashboard;