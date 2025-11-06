// PAGE JADWAL PIC

import React, { useEffect, useState } from "react";
import SidebarUsr from "../../components/sidebar-user";
import NavbarUsr from "../../components/navbar-user";
import { LuAlignJustify } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { BiSolidCalendar } from "react-icons/bi";
import { RiBallPenFill } from "react-icons/ri";
import { FaFileDownload } from "react-icons/fa";
import axios from 'axios'
import { toast } from "react-toastify";
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

import "../../styles/user.css";

function JadwalPic() {
    useEffect(() => {
        document.title = "Jadwal PIC";
        fetchJadwalPic()
    }, []);

    const fetchJadwalPic = async()=>{
        const token = localStorage.getItem("token")
        try{
            let res = await axios.get("http://localhost:3000/pic/jadwal", {
                    headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data.data)
            const rawData = res.data.data
            const groupedData = rawData.reduce((acc, item)=>{
                const instansi = item.instansi
                const periode = `${dayjs(item.tanggal_mulai).format("DD MMM YYYY")} s.d. ${dayjs(item.tanggal_selesai).format("DD MMM YYYY")}`;

                if(!acc[instansi]) acc[instansi] = {instansi, jadwal: []}
                let jadwal = acc[instansi].jadwal.find((j)=> j.tanggal === periode)
                if(!jadwal){
                    jadwal = {tanggal:periode, peserta:[]}
                    acc[instansi].jadwal.push(jadwal)
                }
                jadwal.peserta.push({
                    id: item.id_peserta_magang,
                    nama: item.nama,
                    nim: item.nomor_identitas,
                    instansi: item.instansi,
                    profil: `http://localhost:3000/static/images/${item.foto_diri}`

                })
                return acc
            }, {})
            setDataJadwalPic(Object.values(groupedData));
        }catch(error){
            console.error(error)
            toast.error("Gagal mengambil data jadwal peserta")
        }
    }

    const [filterInstansi, setFilterInstansi] = useState("");
    const [openInstansi, setOpenInstansi] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [dataJadwalPic, setDataJadwalPic] = useState([])
    const [searchTerm, setSearchTerm] = useState("");

    // fungsi untuk highlight hasil pencarian
    const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, "<mark style='background-color: #ffe49c'>$1</mark>");
    };

    const handleOpenModal = (peserta) => {
        setSelectedPeserta(peserta);
        setShowModal(true);
    };

    // pecah jadwal jadi per 5 kolom
    const chunkArray = (arr, size) =>
        arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

    // ambil daftar instansi untuk filter
    const instansiList = dataJadwalPic.map((item) => item.instansi);

    // filter instansi
const jadwalFiltered = dataJadwalPic
    .filter((j) => (filterInstansi ? j.instansi === filterInstansi : true))
    .map((j) => {
        const matchInstansi = j.instansi.toLowerCase().includes(searchTerm.toLowerCase());
        const filteredJadwal = j.jadwal
        .map((jadwal) => {
            const matchTanggal = jadwal.tanggal.toLowerCase().includes(searchTerm.toLowerCase());
            const pesertaFiltered = jadwal.peserta.filter((p) =>
            p.nama.toLowerCase().includes(searchTerm.toLowerCase())
            );
            // jika nama, instansi, atau tanggal cocok maka tampilkan
            if (matchTanggal || pesertaFiltered.length > 0 || matchInstansi)
            return { ...jadwal, peserta: pesertaFiltered.length > 0 ? pesertaFiltered : jadwal.peserta };
            return null;
        })
        .filter(Boolean);

        return { ...j, jadwal: filteredJadwal };
    })
    .filter((j) => j.jadwal.length > 0);

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
    }, [dataJadwalPic, filterInstansi]);

    return (
        <div className="jp-app-layout">
        <SidebarUsr 
            menuItems={[
                { path: "/pic-jadwal", label: "Jadwal", icon: <BiSolidCalendar /> },
                { path: "/pic-penilaian", label: "Penilaian", icon: <RiBallPenFill /> },
                { path: "/files/buku-panduan-pic.pdf", label: "Buku Panduan", icon: <FaFileDownload  />, isDownload: true },
                
            ]}
        />
        <div className="jp-content-area">
            <NavbarUsr onSearch={setSearchTerm} />

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
                        <p dangerouslySetInnerHTML={{ __html: highlightText(data.instansi) }}></p>
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
                            <div
                            className="jp-col-header"
                            dangerouslySetInnerHTML={{ __html: highlightText(jadwal.tanggal) }}
                            ></div>
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
                                    <span dangerouslySetInnerHTML={{ __html: highlightText(p.nama) }}></span>
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
