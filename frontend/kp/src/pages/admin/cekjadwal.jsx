// PAGE DATA JADWAL PESERTA MAGANG (VERSI BERSIH + DATA DUMMY)

import React, { useEffect, useState } from "react";
import SidebarUsr from "../../components/sidebar-adm";
import NavbarUsr from "../../components/navbar-adm";
import { LuAlignJustify } from "react-icons/lu";
import "../../styles/dashboard.css";
import "../../styles/user.css";
import "../../styles/datanilaiaspek.css";

// SEARCH + HIGHLIGHT
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

    function DataJadwalPeserta() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterInstansi, setFilterInstansi] = useState("");
    const [openInstansi, setOpenInstansi] = useState({});

    const [dataJadwalPeserta, setDataJadwalPeserta] = useState([]);

    useEffect(() => {
        document.title = "Admin MAPTA";

        const dummy = [
        {
            id_peserta_magang: 1,
            nama: "Budi Siregar",
            instansi: "SMKN 1 Surabaya",
            jadwalPeserta: {
            periode: [
                "20 November 2025 - 27 November 2025",
                "28 November 2025 - 05 Desember 2025",
                "06 Desember 2025 - 13 Desember 2025",
                "14 Desember 2025 - 20 Desember 2025",
            ],
            bidang: [
                {
                nama: "Pelayanan Perpustakaan",
                jadwal: [
                    "Budi Siregar",
                    "Budi Siregar",
                    "-",
                    "Budi Siregar",
                ]
                },
                {
                nama: "Pengolahan Bahan Pustaka",
                jadwal: [
                    "-",
                    "Budi Siregar",
                    "Budi Siregar",
                    "-",
                ]
                }
            ]
            }
        },
        {
            id_peserta_magang: 2,
            nama: "Ayu Lestari",
            instansi: "SMKN 1 Surabaya",
            jadwalPeserta: {
            periode: [
                "20 November 2025 - 27 November 2025",
                "28 November 2025 - 05 Desember 2025",
                "06 Desember 2025 - 13 Desember 2025",
                "14 Desember 2025 - 20 Desember 2025",
            ],
            bidang: [
                {
                nama: "Pelayanan Informasi",
                jadwal: [
                    "Ayu Lestari",
                    "Ayu Lestari",
                    "Ayu Lestari",
                    "Ayu Lestari",
                ]
                }
            ]
            }
        },
        {
            id_peserta_magang: 3,
            nama: "Fathur Rohman",
            instansi: "MAN 2 Sidoarjo",
            jadwalPeserta: {
            periode: [
                "20 November 2025 - 27 November 2025",
                "28 November 2025 - 05 Desember 2025",
                "06 Desember 2025 - 13 Desember 2025",
                "14 Desember 2025 - 20 Desember 2025",
            ],
            bidang: [
                {
                nama: "Kearsipan",
                jadwal: [
                    "Fathur Rohman",
                    "-",
                    "Fathur Rohman",
                    "-",
                ]
                },
                {
                nama: "Preservasi Arsip",
                jadwal: [
                    "-",
                    "-",
                    "Fathur Rohman",
                    "Fathur Rohman",
                ]
                }
            ]
            }
        }
        ];

        setDataJadwalPeserta(dummy);

        const defaultOpen = {};
        dummy.forEach((d) => {
        defaultOpen[d.instansi] = true;
        });
        setOpenInstansi(defaultOpen);

    }, []);

    // GROUP INSTANSI
    const groupedByInstansi = (list) =>
        list.reduce((acc, item) => {
        if (!acc[item.instansi]) acc[item.instansi] = [];
        acc[item.instansi].push(item);
        return acc;
        }, {});

    const instansiList = [...new Set(dataJadwalPeserta.map((i) => i.instansi))];

    // SEARCH
    const dataFilteredSearch = dataJadwalPeserta.filter(
        (item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instansi.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // FILTER INSTANSI
    const finalFilteredData = filterInstansi
        ? groupedByInstansi(
            dataFilteredSearch.filter((d) => d.instansi === filterInstansi)
        )
        : groupedByInstansi(dataFilteredSearch);

    return (
        <div className="app-layout">
        <SidebarUsr />
        <div className="content-area">
            <NavbarUsr onSearch={setSearchTerm} />

            <section className="main">

            <div className="submain">
                <p className="judul-submain">Daftar Jadwal Peserta Magang</p>

                <select
                className="dropdown-instansi"
                value={filterInstansi}
                onChange={(e) => setFilterInstansi(e.target.value)}
                >
                <option value="">Pilih Instansi</option>
                {instansiList.map((inst, idx) => (
                    <option key={idx} value={inst}>
                    {inst}
                    </option>
                ))}
                </select>
            </div>

            {/* INSTANSI */}
            {Object.entries(finalFilteredData).map(([instansi, peserta]) => {
                const isOpen = openInstansi[instansi];

                return (
                <div className="container-instansi" key={instansi}>
                    <div className="instansi-header">
                        <div className="teks-instansi">
                            <p>{highlightText(instansi, searchTerm)}</p>
                        </div>
                    </div>

                    {/* PESERTA */}
                    <div
                    >
                    {peserta.map((p) => (
                        <div className="dp-penilaian-card" key={p.id_peserta_magang}>
                        <div className="dp-penilaian-header">
                            <span>{highlightText(p.nama, searchTerm)}</span>
                        </div>

                        {/* TABEL JADWAL */}
                            <table className="jp-table-jadwal">
                            <thead>
                                <tr>
                                <th>Tempat Departemen</th>
                                {p.jadwalPeserta?.periode?.map((prd, idx) => (
                                    <th key={idx}>{prd}</th>
                                ))}
                                </tr>
                            </thead>

                            <tbody>
                                {p.jadwalPeserta?.bidang?.map((b, idx) => (
                                <tr key={idx}>
                                    <td className="jp-departemen-cell">{b.nama}</td>

                                    {b.jadwal.map((j, i) => (
                                    <td key={i}>{j}</td>
                                    ))}
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    ))}
                    </div>
                </div>
                );
            })}
            </section>
        </div>
        </div>
    );
}

export default DataJadwalPeserta;
