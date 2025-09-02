// PAGE NILAI PESERTA

import React, { useEffect, useState } from "react";
import SidebarUsr from "../../components/sidebar-user";
import NavbarUsr from "../../components/navbar-user";
import { LuAlignJustify } from "react-icons/lu";
import { BiSolidCalendar } from "react-icons/bi";
import { FaCircleCheck } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";

import "../../styles/user.css";

import profil1 from "../../assets/images/profil1.jpg";

function NilaiPeserta() {
    useEffect(() => {
        document.title = "Nilai Peserta";
    }, []);

    // contoh data nilai (dummy) UNTUK SATU USER
    const nilaiDummy = [
        {
            departemen: "Pelayanan Perpustakaan dan Informasi",
            peserta: {
                id: 1,
                nama: "Budi Santoso",
                nim: "1234567890",
                departemen: "Pelayanan Perpustakaan dan Informasi",
                profil: profil1,
                aspekTeknis: [
                    { nama: "Manajemen", nilai: 80 },
                    { nama: "Pengolahan", nilai: 75 },
                ],
                aspekNonTeknis: [
                    { nama: "Kehadiran", nilai: 90 },
                    { nama: "Etika", nilai: 85 },
                ],
            },
        },
        {
            departemen: "Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan",
            peserta: {
                id: 2,
                nama: "Budi Santoso",
                nim: "1234567890",
                departemen: "Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan",
                profil: profil1,
                aspekTeknis: [],
                aspekNonTeknis: [],
            },
        },
    ];

    const [filterDepartemen, setFilterDepartemen] = useState("");
    const [openDepartemen, setOpenDepartemen] = useState({});

    // toggle departemen buka/tutup
    const toggleDepartemen = (departemen) => {
        setOpenDepartemen((prev) => ({
            ...prev,
            [departemen]: !prev[departemen],
        }));
    };

    const departemenList = nilaiDummy.map((item) => item.departemen);

    const dataFiltered = filterDepartemen
        ? nilaiDummy.filter((d) => d.departemen === filterDepartemen)
        : nilaiDummy;

    useEffect(() => {
        const initState = {};
        departemenList.forEach((departemen) => (initState[departemen] = true));
        setOpenDepartemen(initState);
    }, [filterDepartemen]);

    const hitungIndeksHuruf = (nilai) => {
        if (!nilai && nilai !== 0) return "-";
        const n = parseFloat(nilai);
        if (n >= 85) return "A";
        if (n >= 70) return "B";
        if (n >= 55) return "C";
        if (n >= 40) return "D";
        return "E";
    };

    const getRataRata = (list) => {
        if (list.length === 0) return { nilai: "-", indeks: "-" };
        const total = list.reduce((acc, cur) => acc + cur.nilai, 0);
        const rataNilai = (total / list.length).toFixed(2);
        const rataIndeks = hitungIndeksHuruf(rataNilai);
        return { nilai: rataNilai, indeks: rataIndeks };
    };

    return (
        <div className="jp-app-layout">
            <SidebarUsr 
                menuItems={[
                    { path: "/peserta-jadwal", label: "Jadwal", icon: <BiSolidCalendar /> },
                    { path: "/peserta-nilai", label: "Nilai", icon: <FaCircleCheck /> },
                    { path: "/peserta-sertifikat", label: "Sertifikat", icon: <IoDocumentText /> },
                ]}
            />
            <div className="jp-content-area">
                <NavbarUsr />

                <section className="jp-main">
                    <div className="jp-submain">
                        <div className="jp-submain-actions">
                            <p className="jp-judul-submain">Nilai Peserta Magang</p>
                        </div>
                        <select
                            className="jp-dropdown-instansi"
                            value={filterDepartemen}
                            onChange={(e) => setFilterDepartemen(e.target.value)}
                        >
                            <option value="">Pilih Departemen</option>
                            {departemenList.map((departemen, idx) => (
                                <option key={idx} value={departemen}>
                                    {departemen}
                                </option>
                            ))}
                        </select>
                    </div>

                    {dataFiltered.map((data) => {
                        const isOpen = openDepartemen[data.departemen];
                        const p = data.peserta; // langsung ambil satu peserta
                        return (
                            <div className="jp-container-instansi" key={data.departemen}>
                                <div className="jp-instansi-header">
                                    <LuAlignJustify
                                        size={25}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => toggleDepartemen(data.departemen)}
                                    />
                                    <div className="jp-teks-instansi">
                                        <p>Departemen</p>
                                        <p>{data.departemen}</p>
                                    </div>
                                </div>

                                <div
                                    className={`jp-contain-table-wrapper ${isOpen ? "open" : "closed"} ${
                                        !isOpen ? "jp-with-gap" : ""
                                    }`}
                                >
                                    <div className="jp-penilaian-card" key={p.id}>
                                        <div className="jp-penilaian-header">
                                            <span>{p.nama}</span>
                                        </div>

                                        <div className="jp-aspek-container">
                                            {/* Aspek Teknis */}
                                            <div className="jp-aspek-box">
                                                <h5>Aspek Teknis</h5>
                                                <table className="jp-table-aspek">
                                                    <thead>
                                                        <tr>
                                                            <th>No</th>
                                                            <th>Aspek yang Dinilai</th>
                                                            <th>Nilai</th>
                                                            <th>Indeks</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {p.aspekTeknis.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={4}>Belum ada nilai</td>
                                                            </tr>
                                                        ) : (
                                                            <>
                                                                {p.aspekTeknis.map((a, i) => (
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{a.nama}</td>
                                                                        <td>{a.nilai}</td>
                                                                        <td>{hitungIndeksHuruf(a.nilai)}</td>
                                                                    </tr>
                                                                ))}
                                                                <tr className="jp-row-rata">
                                                                    <td colSpan={2}>
                                                                        <b>Rata-rata</b>
                                                                    </td>
                                                                    <td>{getRataRata(p.aspekTeknis).nilai}</td>
                                                                    <td>{getRataRata(p.aspekTeknis).indeks}</td>
                                                                </tr>
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Aspek Non Teknis */}
                                            <div className="jp-aspek-box">
                                                <h5>Aspek Non Teknis</h5>
                                                <table className="jp-table-aspek">
                                                    <thead>
                                                        <tr>
                                                            <th>No</th>
                                                            <th>Aspek yang Dinilai</th>
                                                            <th>Nilai</th>
                                                            <th>Indeks</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {p.aspekNonTeknis.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={4}>Belum ada nilai</td>
                                                            </tr>
                                                        ) : (
                                                            <>
                                                                {p.aspekNonTeknis.map((a, i) => (
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{a.nama}</td>
                                                                        <td>{a.nilai}</td>
                                                                        <td>{hitungIndeksHuruf(a.nilai)}</td>
                                                                    </tr>
                                                                ))}
                                                                <tr className="jp-row-rata">
                                                                    <td colSpan={2}>
                                                                        <b>Rata-rata</b>
                                                                    </td>
                                                                    <td>{getRataRata(p.aspekNonTeknis).nilai}</td>
                                                                    <td>{getRataRata(p.aspekNonTeknis).indeks}</td>
                                                                </tr>
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>
            </div>
        </div>
    );
}

export default NilaiPeserta;
