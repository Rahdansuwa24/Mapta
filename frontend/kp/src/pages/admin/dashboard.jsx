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

import profil1 from "../../assets/images/profil1.jpg";
import profil2 from "../../assets/images/profil2.jpeg";

function Dashboard() {
    useEffect(() => {
        document.title = "Admin MAPTA";
    }, []);

    const [calonPeserta, setCalonPeserta] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    
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
    const [showModal, setShowModal] = useState(false);
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [filterInstansi, setFilterInstansi] = useState("");
    const [openInstansi, setOpenInstansi] = useState({}); // state untuk toggle tabel per instansi

    // state untuk popup kuota
  const [showKuotaModal, setShowKuotaModal] = useState(false);
  const [kuota, setKuota] = useState(null);

    const handleOpenModal = (peserta) => {
        setSelectedPeserta(peserta);
        setShowModal(true);
    };

    // Filter peserta jika dropdown dipilih
    const pesertaFiltered = filterInstansi
        ? calonPeserta.filter((p) => p.instansi === filterInstansi)
        : calonPeserta;

    // ambil daftar instansi unik
    const instansiList = [
    ...new Set(calonPeserta.map((p) => p.instansi))
    ];

    // Kelompokkan peserta berdasarkan instansi
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

    // handler kuota
  const incrementKuota = () => setKuota((prev) => prev + 1);
  const decrementKuota = () => setKuota((prev) => (prev > 0 ? prev - 1 : 0));
  const handleInputKuota = (e) => setKuota(Number(e.target.value));

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
                <NavbarAdm />

                <section className="main">
                    <div className="submain">
                        <p className="judul-submain">Peserta Magang yang Mendaftar</p>
                        
                        {/* tombol ubah kuota */}
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
                            <p>Instansi</p>
                            <p>{instansi}</p>
                        </div>
                        </div>

                        {/* contain-table muncul kalau openInstansi[instansi] true */}
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
                                            <span>{peserta.nama}</span>
                                        </td>
                                        <td>{peserta.instansi}</td>
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
                                            <span>{peserta.nama}</span>
                                        </td>
                                        <td>{peserta.instansi}</td>
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

                {/* MODAL */}
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
                                {/* <div className="detail-item">
                                    <b>Password :</b>
                                    <p>{selectedPeserta.password}</p>
                                </div> */}

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
                {/* MODAL UBAH KUOTA */}
                {showKuotaModal && (
                <div className="kuota-overlay" onClick={() => setShowKuotaModal(false)}>
                    <div
                    className="input-group" // class utama tetap input-group sesuai style lama
                    onClick={(e) => e.stopPropagation()} // klik di dalam tidak menutup
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