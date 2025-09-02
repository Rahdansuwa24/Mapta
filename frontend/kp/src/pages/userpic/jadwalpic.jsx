// PAGE JADWAL PIC

import React, { useEffect, useState } from "react";
import SidebarUsr from "../../components/sidebar-user";
import NavbarUsr from "../../components/navbar-user";
import { LuAlignJustify } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { BiSolidCalendar } from "react-icons/bi";
import { RiBallPenFill } from "react-icons/ri";

import "../../styles/user.css";

import profil1 from "../../assets/images/profil1.jpg";
import profil2 from "../../assets/images/profil2.jpeg";

function JadwalPic() {
    useEffect(() => {
        document.title = "Jadwal PIC";
    }, []);

    // contoh data jadwal per instansi
    const jadwalDummy = [
    {
        instansi: "Politeknik Elektronika Negeri Surabaya",
        jadwal: [
        {
            tanggal: "10 Juli s.d. 10 Agustus 2025",
            peserta: [
            {
                id: 1,
                nama: "Budi Santoso",
                nim: "1234567890",
                instansi: "Politeknik Elektronika Negeri Surabaya",
                profil: profil1,
            },
            {
                id: 2,
                nama: "Ahmad Ifcel",
                nim: "1122334455",
                instansi: "Politeknik Elektronika Negeri Surabaya",
                profil: profil2,
            },
            ],
        },
        {
            tanggal: "15 Desember 2025 s.d. 15 Januari 2026",
            peserta: [
            {
                id: 3,
                nama: "Ahmad Lexy",
                nim: "9988776655",
                instansi: "Politeknik Elektronika Negeri Surabaya",
                profil: profil2,
            },
            ],
        },
        {
            tanggal: "20 Juli s.d. 20 Agustus 2025",
            peserta: [],
        },
        {
            tanggal: "25 Juli s.d. 25 Agustus 2025",
            peserta: [
            {
                id: 4,
                nama: "Danang",
                nim: "8877665544",
                instansi: "Politeknik Elektronika Negeri Surabaya",
                profil: profil1,
            },
            {
                id: 5,
                nama: "Vernanda",
                nim: "7766554433",
                instansi: "Politeknik Elektronika Negeri Surabaya",
                profil: profil1,
            },
            ],
        },
        {
            tanggal: "30 Juli s.d. 30 Agustus 2025",
            peserta: [
            {
                id: 6,
                nama: "Haidar",
                nim: "6655443322",
                instansi: "Politeknik Elektronika Negeri Surabaya",
                profil: profil1,
            },
            ],
        },
        {
            tanggal: "5 Agustus s.d. 5 September 2025",
            peserta: [
            {
                id: 7,
                nama: "Aqil",
                nim: "5544332211",
                instansi: "Politeknik Elektronika Negeri Surabaya",
                profil: profil2,
            },
            ],
        },
        ],
    },
    {
        instansi: "Universitas Indonesia",
        jadwal: [
        {
            tanggal: "10 Juli s.d. 10 Agustus 2025",
            peserta: [
            {
                id: 8,
                nama: "Budi Santoso",
                nim: "1234567890",
                instansi: "Universitas Indonesia",
                profil: profil1,
            },
            {
                id: 9,
                nama: "Ahmad Ifcel",
                nim: "1122334455",
                instansi: "Universitas Indonesia",
                profil: profil2,
            },
            ],
        },
        ],
    },
    {
        instansi: "Institut Teknologi Sepuluh Nopember",
        jadwal: [
        {
            tanggal: "01 September s.d. 30 November 2025",
            peserta: [
            {
                id: 10,
                nama: "Dewi Lestari",
                nim: "5678901234",
                instansi: "Institut Teknologi Sepuluh Nopember",
                profil: profil1,
            },
            {
                id: 11,
                nama: "Rizky Maulana",
                nim: "2233445566",
                instansi: "Institut Teknologi Sepuluh Nopember",
                profil: profil2,
            },
            ],
        },
        {
            tanggal: "05 Januari s.d. 05 Maret 2026",
            peserta: [
            {
                id: 12,
                nama: "Siti Aminah",
                nim: "4455667788",
                instansi: "Institut Teknologi Sepuluh Nopember",
                profil: profil1,
            },
            ],
        },
        ],
    },
    ];

    const [filterInstansi, setFilterInstansi] = useState("");
    const [openInstansi, setOpenInstansi] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedPeserta, setSelectedPeserta] = useState(null);

    const handleOpenModal = (peserta) => {
        setSelectedPeserta(peserta);
        setShowModal(true);
    };

    // pecah jadwal jadi per 5 kolom
    const chunkArray = (arr, size) =>
        arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

    // ambil daftar instansi untuk filter
    const instansiList = jadwalDummy.map((item) => item.instansi);

    // filter instansi
    const jadwalFiltered = filterInstansi
        ? jadwalDummy.filter((j) => j.instansi === filterInstansi)
        : jadwalDummy;

    // toggle instansi buka/tutup
    const toggleInstansi = (instansi) => {
        setOpenInstansi((prev) => ({
        ...prev,
        [instansi]: !prev[instansi],
        }));
    };

    useEffect(() => {
        const initialState = {};
        instansiList.forEach((instansi) => {
        initialState[instansi] = true;
        });
        setOpenInstansi(initialState);
    }, [filterInstansi]);

    return (
        <div className="jp-app-layout">
        <SidebarUsr 
            menuItems={[
                { path: "/pic-jadwal", label: "Jadwal", icon: <BiSolidCalendar /> },
                { path: "/pic-penilaian", label: "Penilaian", icon: <RiBallPenFill /> },
            ]}
        />
        <div className="jp-content-area">
            <NavbarUsr />

            <section className="jp-main">
            <div className="jp-submain">
                <p className="jp-judul-submain">Jadwal Peserta Magang</p>
                <select
                className="jp-dropdown-instansi"
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

            {jadwalFiltered.map((data) => {
                const jadwalChunks = chunkArray(data.jadwal, 5);
                const isOpen = openInstansi[data.instansi];

                return (
                <div className="jp-container-instansi" key={data.instansi}>
                    <div className="jp-instansi-header">
                    <LuAlignJustify
                        size={25}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleInstansi(data.instansi)}
                    />
                    <div className="jp-teks-instansi">
                        <p>Instansi</p>
                        <p>{data.instansi}</p>
                    </div>
                    </div>

                    {/* selalu render, class dikendalikan */}
                    <div
                    className={`jp-contain-table-wrapper ${isOpen ? "open" : "closed"} ${
                        !isOpen ? "jp-with-gap" : ""
                    }`}
                    >
                    {jadwalChunks.map((row, rowIndex) => (
                        <div key={rowIndex} className="jp-row">
                        {row.map((jadwal, idx) => (
                            <div key={idx} className="jp-col">
                            <div className="jp-col-header">{jadwal.tanggal}</div>
                            <div className="jp-col-body">
                                {jadwal.peserta.length === 0 ? (
                                <p>-</p>
                                ) : (
                                jadwal.peserta.map((p) => (
                                    <div
                                    key={p.id}
                                    className="jp-peserta-item"
                                    onClick={() => handleOpenModal(p)}
                                    >
                                    <img
                                        src={p.profil}
                                        alt="profil"
                                        className="jp-peserta-foto"
                                    />
                                    <span>{p.nama}</span>
                                    </div>
                                ))
                                )}
                            </div>
                            </div>
                        ))}
                        </div>
                    ))}
                    </div>
                </div>
                );
            })}
            </section>

            {showModal && selectedPeserta && (
            <div className="jp-overlay" onClick={() => setShowModal(false)}>
                <div className="jp-modal" onClick={(e) => e.stopPropagation()}>
                <div className="jp-modal-header">
                    <span>Detail Peserta</span>
                    <div className="jp-close-btn" onClick={() => setShowModal(false)}>
                    <FaTimes />
                    </div>
                </div>
                <div className="jp-modal-body">
                    <div className="jp-profile-pic">
                    <img src={selectedPeserta.profil} alt="profil" />
                    </div>
                    <div className="jp-detail-item">
                    <b>Nama:</b> {selectedPeserta.nama}
                    </div>
                    <div className="jp-detail-item">
                    <b>NIM/NIP:</b> {selectedPeserta.nim}
                    </div>
                    <div className="jp-detail-item">
                    <b>Instansi:</b> {selectedPeserta.instansi}
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    );
}

export default JadwalPic;
