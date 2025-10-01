// PAGE NILAI PESERTA

import React, { useEffect, useState } from "react";
import SidebarUsr from "../../components/sidebar-user";
import NavbarUsr from "../../components/navbar-user";
import { LuAlignJustify } from "react-icons/lu";
import { BiSolidCalendar } from "react-icons/bi";
import { FaCircleCheck } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import axios from 'axios'
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

import "../../styles/user.css";

import profil1 from "../../assets/images/profil1.jpg";

function NilaiPeserta() {
    useEffect(() => {
        document.title = "Nilai Peserta";
        fetchNilaiPeserta()
    }, []);


    const fetchNilaiPeserta = async()=>{
        const token = localStorage.getItem("token")
        try{
            const res = await axios.get("http://localhost:3000/peserta/penilaian", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data.data)
            const dataNilai = res.data.data.map((item)=>{
                const aspekTeknisArr = item.aspek_teknis?item.aspek_teknis.split(", "): []
                const nilaiTeknisArr = item.nilai_teknis?item.nilai_teknis.split(", ").map(Number): []
                const idPenilaianTeknisArr = item.id_penilaian_teknis ? item.id_penilaian_teknis.split(",").map(x => parseInt(x.trim())) : [];
                const idAspekTeknisArr = item.id_aspek_teknis ? item.id_aspek_teknis.split(",").map(x => parseInt(x.trim())) : [];

                const aspekNonTeknisArr = item.aspek_non_teknis ? item.aspek_non_teknis.split(", "):[];
                const nilaiNonTeknisArr = item.nilai_non_teknis ? item.nilai_non_teknis.split(", ").map(Number):[];
                const idPenilaianNonTeknisArr = item.id_penilaian_non_teknis ? item.id_penilaian_non_teknis.split(",").map(x => parseInt(x.trim())) : [];
                const idAspekNonTeknisArr = item.id_aspek_non_teknis ? item.id_aspek_non_teknis.split(",").map(x => parseInt(x.trim())) : [];

                const aspekTeknis = aspekTeknisArr.map((a, i) => ({
                    id_aspek: idAspekTeknisArr[i] || null,
                    id_penilaian: idPenilaianTeknisArr[i] || null,
                    aspek: a,
                    nilai: nilaiTeknisArr[i] || 0,
                }))

                const aspekNonTeknis = aspekNonTeknisArr.map((a, i) => ({
                    id_aspek: idAspekNonTeknisArr[i] || null,
                    id_penilaian: idPenilaianNonTeknisArr[i] || null,
                    aspek: a,
                    nilai: nilaiNonTeknisArr[i] || 0,
                }))

                return {
                    ...item,
                    bidang: item.bidang || "-",   // ⬅️ tambahkan bidang
                    aspekTeknis,
                    aspekNonTeknis,
                }
            })
            setNilaiPeserta(dataNilai)
        }catch(error){
            console.error(error)
            alert("gagal fetching data")
        }
    }
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
    const [nilaiPeserta, setNilaiPeserta] = useState([])

    // toggle departemen buka/tutup
    const toggleDepartemen = (departemen) => {
        setOpenDepartemen((prev) => ({
            ...prev,
            [departemen]: !prev[departemen],
        }));
    };

    const departemenList = nilaiPeserta.map((item) => item.bidang);

    const dataFiltered = filterDepartemen
        ? nilaiPeserta.filter((d) => d.bidang === filterDepartemen)
        : nilaiPeserta;

    useEffect(() => {
        const initState = {};
        departemenList.forEach((bidang) => (initState[bidang] = true));
        setOpenDepartemen(initState);
    }, [filterDepartemen, nilaiPeserta]);

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
                        const isOpen = openDepartemen[data.bidang];
                        return (
                            <div className="jp-container-instansi" key={data.bidang}>
                                <div className="jp-instansi-header">
                                    <LuAlignJustify
                                        size={25}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => toggleDepartemen(data.bidang)}
                                    />
                                    <div className="jp-teks-instansi">
                                        <p>Departemen</p>
                                        <p>{data.bidang}</p>
                                    </div>
                                </div>

                                <div
                                    className={`jp-contain-table-wrapper ${isOpen ? "open" : "closed"} ${
                                        !isOpen ? "jp-with-gap" : ""
                                    }`}
                                >
                                    <div className="jp-penilaian-card" key={data.id_peserta_magang}>
                                        <div className="jp-penilaian-header">
                                            <span>{data.nama}</span>
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
                                                        {data.aspekTeknis.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={4}>Belum ada nilai</td>
                                                            </tr>
                                                        ) : (
                                                            <>
                                                                {data.aspekTeknis.map((a, i) => (
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{a.aspek}</td>
                                                                        <td>{a.nilai}</td>
                                                                        <td>{hitungIndeksHuruf(a.nilai)}</td>
                                                                    </tr>
                                                                ))}
                                                                <tr className="jp-row-rata">
                                                                    <td colSpan={2}>
                                                                        <b>Rata-rata</b>
                                                                    </td>
                                                                    <td>{getRataRata(data.aspekTeknis).nilai}</td>
                                                                    <td>{getRataRata(data.aspekTeknis).indeks}</td>
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
                                                        {data.aspekNonTeknis.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={4}>Belum ada nilai</td>
                                                            </tr>
                                                        ) : (
                                                            <>
                                                                {data.aspekNonTeknis.map((a, i) => (
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{a.aspek}</td>
                                                                        <td>{a.nilai}</td>
                                                                        <td>{hitungIndeksHuruf(a.nilai)}</td>
                                                                    </tr>
                                                                ))}
                                                                <tr className="jp-row-rata">
                                                                    <td colSpan={2}>
                                                                        <b>Rata-rata</b>
                                                                    </td>
                                                                    <td>{getRataRata(data.aspekNonTeknis).nilai}</td>
                                                                    <td>{getRataRata(data.aspekNonTeknis).indeks}</td>
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
