// PAGE JADWAL ADMIN 

import React, { useEffect, useState } from "react";
import SidebarAdmJd from "../../components/sidebar-adm";
import NavbarAdmJd from "../../components/navbar-adm";
import { LuAlignJustify } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";

import "../../styles/dashboard.css";

function Jadwal() {
    useEffect(() => {
        document.title = "Admin Jadwal";
    }, []);

    // Dummy data
    const pesertaDummy = [
        { id: 1, nama: "Budi Santoso", instansi: "Politeknik Elektronika Negeri Surabaya" },
        { id: 2, nama: "Danang Cosmos", instansi: "Politeknik Elektronika Negeri Surabaya" },
        { id: 3, nama: "Siti Aisyah", instansi: "Politeknik Elektronika Negeri Surabaya" },
        { id: 4, nama: "Ahmad Ifcel", instansi: "Universitas Airlangga" },
    ];

        // Dummy jadwal
    const jadwalDummy = [
        {
        id: 1,
        nama: "Budi Santoso",
        instansi: "Politeknik Elektronika Negeri Surabaya",
        departemen: "Kesekretariatan",
        tglMulai: "01-09-2025",
        tglSelesai: "30-11-2025",
        },
        {
        id: 2,
        nama: "Danang Cosmos",
        instansi: "Politeknik Elektronika Negeri Surabaya",
        departemen: "Pengembangan Sumber Daya",
        tglMulai: "01-09-2025",
        tglSelesai: "30-11-2025",
        },
        {
        id: 3,
        nama: "Lexy Pikachu",
        instansi: "Politeknik Elektronika Negeri Surabaya",
        departemen: "Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan",
        tglMulai: "01-09-2025",
        tglSelesai: "30-11-2025",
        },
    ];

    const [filterDepartemen, setFilterDepartemen] = useState("");
    const [openDepartemen, setOpenDepartemen] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editingJadwal, setEditingJadwal] = useState(null);
    const [jadwalData, setJadwalData] = useState(jadwalDummy); // simpan jadwal dalam state, bukan const

    // State form jadwal
    const [formJadwal, setFormJadwal] = useState({
        instansi: "",
        peserta: "",
        tglMulai: "",
        tglSelesai: "",
        departemen: "",
    });

    // Departemen static
    const departemenStatic = [
        "Kesekretariatan",
        "Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan",
        "Pelayanan Perpustakaan dan Informasi",
        "Pengembangan Sumber Daya",
        "Penyelamatan dan Pendayagunaan Kearsipan",
        "Pembinaan dan Pengawasan Kearsipan",
    ];

    // Filter jadwal berdasarkan departemen
    const jadwalFiltered = filterDepartemen
        ? jadwalDummy.filter((j) => j.departemen === filterDepartemen)
        : jadwalDummy;

    // List departemen unik dari jadwal
    const departemenList = [...new Set(jadwalDummy.map((j) => j.departemen))];

    // Grouping jadwal per departemen
    const jadwalPerDepartemen = jadwalFiltered.reduce((acc, item) => {
        if (!acc[item.departemen]) acc[item.departemen] = [];
        acc[item.departemen].push(item);
        return acc;
    }, {});

    const toggleDepartemen = (departemen) => {
        setOpenDepartemen((prev) => ({
        ...prev,
        [departemen]: !prev[departemen],
        }));
    };

    useEffect(() => {
        const initialState = {};
        Object.keys(jadwalPerDepartemen).forEach((departemen) => {
        initialState[departemen] = true;
        });
        setOpenDepartemen(initialState);
    }, [filterDepartemen]);

    // Ambil peserta sesuai instansi dipilih
    const pesertaFiltered = formJadwal.instansi
        ? pesertaDummy.filter((p) => p.instansi === formJadwal.instansi)
        : [];

    return (
        <div className="app-layout">
        <SidebarAdmJd />
        <div className="content-area">
            <NavbarAdmJd />

            <section className="main">
                <div className="submain">
                <div className="submain-left">
                    <p className="judul-submain">Jadwal Penempatan Magang</p>
                    <button
                        className="btn-buat-jadwal"
                        onClick={() => {
                            setFormJadwal({
                            instansi: "",
                            peserta: "",
                            tglMulai: "",
                            tglSelesai: "",
                            departemen: "",
                            });
                            setEditingJadwal(null); // reset mode edit
                            setShowModal(true);
                        }}
                        >
                        Buat Jadwal
                    </button>
                </div>

                <select
                    className="dropdown-instansi"
                    value={filterDepartemen}
                    onChange={(e) => setFilterDepartemen(e.target.value)}
                >
                    <option value="">Pilih Jadwal Departemen</option>
                    {departemenList.map((dept, idx) => (
                    <option key={idx} value={dept}>
                        {dept}
                    </option>
                    ))}
                </select>
                </div>

            {Object.keys(jadwalPerDepartemen).map((departemen) => {
                const jadwalDept = jadwalPerDepartemen[departemen];
                return (
                <div className="container-instansi" key={departemen}>
                    <div className="instansi-header">
                    <LuAlignJustify
                        size={25}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleDepartemen(departemen)}
                    />
                    <div className="teks-instansi">
                        <p>Departemen</p>
                        <p>{departemen}</p>
                    </div>
                    </div>

                    <div
                    className={`contain-table-wrapper ${
                        openDepartemen[departemen] ? "open" : "closed"
                    } ${!openDepartemen[departemen] ? "with-gap" : ""}`}
                    >
                    <div className="contain-table">
                        <div className="table-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Instansi</th>
                                <th>Penempatan Departemen</th>
                                <th>Tanggal Mulai Penempatan</th>
                                <th>Tanggal Selesai Penempatan</th>
                                <th>Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {jadwalDept.map((item, idx) => (
                                <tr key={item.id}>
                                <td>{idx + 1}</td>
                                <td>{item.nama}</td>
                                <td>{item.instansi}</td>
                                <td>{item.departemen}</td>
                                <td>{item.tglMulai}</td>
                                <td>{item.tglSelesai}</td>
                                <td className="aksi-cell">
                                <div className="aksi-wrapper">
                                    <TbEdit
                                    style={{ cursor: "pointer", marginRight: "10px", fontSize: "22px" }}
                                    title="Edit Jadwal"
                                    onClick={() => {
                                        setFormJadwal({
                                        instansi: item.instansi,
                                        peserta: item.nama,
                                        tglMulai: item.tglMulai,
                                        tglSelesai: item.tglSelesai,
                                        departemen: item.departemen,
                                        });
                                        setEditingJadwal(item); // simpan data sedang diedit
                                        setShowModal(true);
                                    }}
                                    />
                                    <MdDeleteOutline
                                    style={{ cursor: "pointer", color: "red", fontSize: "22px" }}
                                    title="Hapus Jadwal"
                                    />
                                </div>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>
                );
            })}
            </section>

            {/* MODAL FORM BUAT JADWAL */}
            {showModal && (
            <div className="jadwal-overlay" onClick={() => setShowModal(false)}>
                <div
                className="jadwal-modal"
                onClick={(e) => e.stopPropagation()}
                >
                <div className="jadwal-modal-header">
                    <span>Buat Jadwal Penempatan</span>
                    <div
                    className="jadwal-close-btn"
                    onClick={() => setShowModal(false)}
                    >
                    <FaTimes />
                    </div>
                </div>

                <div className="jadwal-modal-body">
                    {/* Instansi */}
                    <div className="jadwal-detail-item">
                    <b>Instansi :</b>
                    <select
                        className="jadwal-input"
                        value={formJadwal.instansi}
                        onChange={(e) =>
                        setFormJadwal({ ...formJadwal, instansi: e.target.value, peserta: "" })
                        }
                    >
                        <option value="">-- Pilih Instansi --</option>
                        {[...new Set(pesertaDummy.map((p) => p.instansi))].map(
                        (inst, idx) => (
                            <option key={idx} value={inst}>
                            {inst}
                            </option>
                        )
                        )}
                    </select>
                    </div>

                    {/* Peserta */}
                    <div className="jadwal-detail-item">
                    <b>Peserta :</b>
                    <select
                        className="jadwal-input"
                        value={formJadwal.peserta}
                        onChange={(e) =>
                        setFormJadwal({ ...formJadwal, peserta: e.target.value })
                        }
                        disabled={!formJadwal.instansi}
                    >
                        <option value="">-- Pilih Peserta --</option>
                        {pesertaFiltered.map((p) => (
                        <option key={p.id} value={p.nama}>
                            {p.nama}
                        </option>
                        ))}
                    </select>
                    </div>

                    {/* Tanggal Mulai */}
                    <div className="jadwal-detail-item">
                    <b>Tanggal Mulai :</b>
                    <input
                        type="date"
                        className="jadwal-input"
                        value={formJadwal.tglMulai}
                        onChange={(e) =>
                        setFormJadwal({ ...formJadwal, tglMulai: e.target.value })
                        }
                    />
                    </div>

                    {/* Tanggal Selesai */}
                    <div className="jadwal-detail-item">
                    <b>Tanggal Selesai :</b>
                    <input
                        type="date"
                        className="jadwal-input"
                        value={formJadwal.tglSelesai}
                        onChange={(e) =>
                        setFormJadwal({ ...formJadwal, tglSelesai: e.target.value })
                        }
                    />
                    </div>

                    {/* Departemen */}
                    <div className="jadwal-detail-item">
                    <b>Departemen :</b>
                    <select
                        className="jadwal-input"
                        value={formJadwal.departemen}
                        onChange={(e) =>
                        setFormJadwal({ ...formJadwal, departemen: e.target.value })
                        }
                    >
                        <option value="">-- Pilih Departemen --</option>
                        {departemenStatic.map((dept, idx) => (
                        <option key={idx} value={dept}>
                            {dept}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div className="jadwal-modal-actions">
                        <button
                        className="btn-save"
                        onClick={() => {
                            if (editingJadwal) {
                            // UPDATE
                            const updated = jadwalData.map((j) =>
                                j.id === editingJadwal.id
                                ? {
                                    ...j,
                                    nama: formJadwal.peserta,
                                    instansi: formJadwal.instansi,
                                    departemen: formJadwal.departemen,
                                    tglMulai: formJadwal.tglMulai,
                                    tglSelesai: formJadwal.tglSelesai,
                                    }
                                : j
                            );
                            setJadwalData(updated);
                            } else {
                            // CREATE
                            const newJadwal = {
                                id: jadwalData.length + 1,
                                nama: formJadwal.peserta,
                                instansi: formJadwal.instansi,
                                departemen: formJadwal.departemen,
                                tglMulai: formJadwal.tglMulai,
                                tglSelesai: formJadwal.tglSelesai,
                            };
                            setJadwalData([...jadwalData, newJadwal]);
                            }

                            setShowModal(false);
                            setEditingJadwal(null);
                        }}
                        >
                        {editingJadwal ? "Update" : "Simpan"}
                        </button>
                    </div>
                </div>
                </div>
            </div>
            )}

        </div>
        </div>
    );
}

export default Jadwal;
