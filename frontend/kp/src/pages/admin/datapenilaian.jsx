// PAGE DATA PENILAIAN ASPEK

import React, { useEffect, useState } from "react";
import SidebarUsr from "../../components/sidebar-adm";
import NavbarUsr from "../../components/navbar-adm";
import { LuAlignJustify } from "react-icons/lu";
import { FaTimes, FaTrash } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";

import "../../styles/dashboard.css";
import "../../styles/datanilaiaspek.css";

import profil1 from "../../assets/images/profil1.jpg";
import profil2 from "../../assets/images/profil2.jpeg";

function DataPenilaianAspek() {
    useEffect(() => {
        document.title = "Data Penilaian Aspek";
    }, []);

    const penilaianDummy = [
        {
            instansi: "Politeknik Elektronika Negeri Surabaya",
            peserta: [
                {
                    id: 1,
                    nama: "Budi Santoso",
                    nim: "1234567890",
                    instansi: "Politeknik Elektronika Negeri Surabaya",
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
                {
                    id: 2,
                    nama: "Ahmad Ifcel",
                    nim: "1122334455",
                    instansi: "Politeknik Elektronika Negeri Surabaya",
                    profil: profil2,
                    aspekTeknis: [],
                    aspekNonTeknis: [],
                },
            ],
        },
        {
            instansi: "Universitas Indonesia",
            peserta: [
                {
                    id: 3,
                    nama: "Dewi Lestari",
                    nim: "5678901234",
                    instansi: "Universitas Indonesia",
                    profil: profil1,
                    aspekTeknis: [],
                    aspekNonTeknis: [],
                },
            ],
        },
    ];

    const aspekTeknisList = ["Manajemen", "Pengolahan", "Pengamanan"];
    const aspekNonTeknisList = [
        "Kehadiran",
        "Skill/Keahlian",
        "Kreatifitas",
        "Komunikasi",
        "Sikap/Etika",
    ];

    const [filterInstansi, setFilterInstansi] = useState("");
    const [openInstansi, setOpenInstansi] = useState({});
    const [showModal, setShowModal] = useState(false);

    const [selectedInstansi, setSelectedInstansi] = useState("");
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [nilaiAspek, setNilaiAspek] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    const toggleInstansi = (instansi) => {
        setOpenInstansi((prev) => ({
            ...prev,
            [instansi]: !prev[instansi],
        }));
    };

    const instansiList = penilaianDummy.map((item) => item.instansi);
    const dataFiltered = filterInstansi
        ? penilaianDummy.filter((d) => d.instansi === filterInstansi)
        : penilaianDummy;

    useEffect(() => {
        const initState = {};
        instansiList.forEach((instansi) => (initState[instansi] = true));
        setOpenInstansi(initState);
    }, [filterInstansi]);

    const handleInputChange = (aspek, value) => {
        setNilaiAspek((prev) => ({
            ...prev,
            [aspek]: value,
        }));
    };

    const pesertaList = selectedInstansi
        ? penilaianDummy.find((d) => d.instansi === selectedInstansi)?.peserta || []
        : [];

    const filteredPesertaList = isEdit
        ? pesertaList
        : pesertaList.filter(
                (p) => p.aspekTeknis.length === 0 && p.aspekNonTeknis.length === 0
            );

    const handleSave = () => {
        console.log("Simpan nilai:", {
            instansi: selectedInstansi,
            peserta: selectedPeserta,
            nilai: nilaiAspek,
        });
        setShowModal(false);
        setNilaiAspek({});
        setSelectedPeserta(null);
        setSelectedInstansi("");
        setIsEdit(false);
    };

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
        <div className="app-layout">
            <SidebarUsr />
            <div className="content-area">
                <NavbarUsr />

                <section className="main">
                    <div className="submain">
                        <div className="dp-submain-actions">
                            <p className="judul-submain">Data Penilaian Peserta Magang</p>
                        </div>
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

                    {dataFiltered.map((data) => {
                        const isOpen = openInstansi[data.instansi];
                        return (
                            <div className="container-instansi" key={data.instansi}>
                                <div className="instansi-header">
                                    <LuAlignJustify
                                        size={25}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => toggleInstansi(data.instansi)}
                                    />
                                    <div className="teks-instansi">
                                        <p>Instansi</p>
                                        <p>{data.instansi}</p>
                                    </div>
                                </div>

                                <div
                                    className={`contain-table-wrapper ${isOpen ? "open" : "closed"} ${
                                        !isOpen ? "with-gap" : ""
                                    }`}
                                >
                                    {data.peserta.map((p) => (
                                        <div className="dp-penilaian-card" key={p.id}>
                                            <div className="dp-penilaian-header">
                                                <span>{p.nama}</span>
                                                <div className="dp-penilaian-actions">
                                                    <span
                                                        onClick={() => {
                                                            setSelectedInstansi(p.instansi);
                                                            setSelectedPeserta(p);
                                                            setIsEdit(true);
                                                            const nilai = {};
                                                            p.aspekTeknis.forEach((a) => (nilai[a.nama] = a.nilai));
                                                            p.aspekNonTeknis.forEach((a) => (nilai[a.nama] = a.nilai));
                                                            setNilaiAspek(nilai);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <TbEdit
                                                            style={{ fontSize: "20px" }}
                                                            className="dp-icon-edit"
                                                        />{" "}
                                                        edit
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="dp-aspek-container">
                                                <div className="dp-aspek-box">
                                                    <h5>Aspek Teknis</h5>
                                                    <table className="dp-table-aspek">
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
                                                                    <tr className="dp-row-rata">
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

                                                <div className="dp-aspek-box">
                                                    <h5>Aspek Non Teknis</h5>
                                                    <table className="dp-table-aspek">
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
                                                                    <tr className="dp-row-rata">
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
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </section>

                {showModal && (
                    <div className="overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>{isEdit ? "Edit Nilai Peserta" : "Isi Nilai Peserta"}</span>
                                <div className="close-btn" onClick={() => setShowModal(false)}>
                                    <FaTimes />
                                </div>
                            </div>

                            <div className="dp-modal-body">
                                <select
                                    value={selectedInstansi}
                                    onChange={(e) => {
                                        setSelectedInstansi(e.target.value);
                                        setSelectedPeserta(null);
                                        setNilaiAspek({});
                                    }}
                                    disabled={isEdit}
                                >
                                    <option value="">Pilih Instansi</option>
                                    {instansiList.map((item, idx) => (
                                        <option key={idx} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedPeserta?.id || ""}
                                    onChange={(e) => {
                                        const peserta = pesertaList.find(
                                            (p) => p.id === parseInt(e.target.value)
                                        );
                                        setSelectedPeserta(peserta);

                                        if (peserta) {
                                            const nilai = {};
                                            peserta.aspekTeknis.forEach((a) => (nilai[a.nama] = a.nilai));
                                            peserta.aspekNonTeknis.forEach((a) => (nilai[a.nama] = a.nilai));
                                            setNilaiAspek(nilai);
                                        } else {
                                            setNilaiAspek({});
                                        }
                                    }}
                                    disabled={!selectedInstansi || isEdit}
                                >
                                    <option value="">Pilih Peserta</option>
                                    {filteredPesertaList.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nama}
                                        </option>
                                    ))}
                                </select>

                                {selectedPeserta && (
                                    <div className="dp-profile-pic">
                                        <img src={selectedPeserta.profil} alt="profil" />
                                    </div>
                                )}

                                <p style={{ fontStyle: "italic", fontWeight: 500 }}>Aspek Teknis</p>
                                {aspekTeknisList.map((a) => (
                                    <div key={a} className="dp-aspek-item">
                                        <span>{a}</span>
                                        <input
                                            type="number"
                                            placeholder="Nilai"
                                            value={nilaiAspek[a] || ""}
                                            onChange={(e) => handleInputChange(a, e.target.value)}
                                        />
                                    </div>
                                ))}

                                <p style={{ fontStyle: "italic", fontWeight: 500 }}>Aspek Non Teknis</p>
                                {aspekNonTeknisList.map((a) => (
                                    <div key={a} className="dp-aspek-item">
                                        <span>{a}</span>
                                        <input
                                            type="number"
                                            placeholder="Nilai"
                                            value={nilaiAspek[a] || ""}
                                            onChange={(e) => handleInputChange(a, e.target.value)}
                                        />
                                    </div>
                                ))}

                                <button className="dp-btn-simpan" onClick={handleSave}>
                                    Simpan Nilai
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DataPenilaianAspek;
