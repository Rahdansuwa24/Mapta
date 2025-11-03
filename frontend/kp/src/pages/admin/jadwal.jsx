// PAGE JADWAL ADMIN 
import React, { useEffect, useState } from "react";
import SidebarAdmJd from "../../components/sidebar-adm";
import NavbarAdmJd from "../../components/navbar-adm";
import { LuAlignJustify } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import axios from 'axios'
import { toast } from "react-toastify";
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

import "../../styles/dashboard.css";

function Jadwal() {
    useEffect(() => {
        document.title = "Admin MAPTA";
    }, []);

    useEffect(() => {
        fetchDataJadwal()
        fetchDataPeriodekosong()
        fetchDataPeserta()
    }, []);

    const [searchTerm, setSearchTerm] = useState("");

    const fetchDataJadwal = async()=>{
        const token = localStorage.getItem("token")
        try{
            const rest = await axios.get("http://localhost:3000/admin/jadwal", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            const dataJadwal = rest.data.data
            setJadwalData(dataJadwal)
        }catch(error){
            toast.error(`Gagal dalam mengambil data jadwal`);
            console.error(error)
        }
    }

    const fetchDataPeriodekosong = async()=>{
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:3000/admin/jadwal/getPeriode", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            try{
                const dataPeriodeKosong = res.data.data
                setPeriodeKosong(dataPeriodeKosong)
            }catch(error){
                toast.error(`Gagal dalam mengambil data periode waktu peserta magang`);
                console.error(error)
            }
    }
    const fetchDataPeserta = async()=>{
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:3000/admin/jadwal/peserta", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            try{
                const dataPeserta = res.data.data
                setDataPeserta(dataPeserta)
            }catch(error){
               toast.error(`Gagal dalam mengambil data peserta yang sudah diterima`);
                console.error(error)
            }
    }

    const handleSave = async()=>{
        const token = localStorage.getItem("token");
        try{
            if(editingJadwal){
                await axios.patch(`http://localhost:3000/admin/jadwal/update/${editingJadwal.id_jadwal}`,{
                    bidang: formJadwal.departemen,
                    id_peserta_magang: formJadwal.id_peserta_magang,
                    tanggal_mulai: formJadwal.tanggal_mulai,
                    tanggal_selesai: formJadwal.tanggal_selesai,
                },{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                toast.success(`Jadwal berhasil diperbarui`);
            }else{
                await axios.post(`http://localhost:3000/admin/jadwal/store`,{
                            
                    bidang: formJadwal.departemen,
                    id_peserta_magang: formJadwal.id_peserta_magang,
                    tanggal_mulai: formJadwal.tanggal_mulai,
                    tanggal_selesai: formJadwal.tanggal_selesai,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                toast.success(`Jadwal berhasil ditambahkan`);
            }

            fetchDataJadwal();
            setShowModal(false);
            setEditingJadwal(null);
        }catch(error){
            console.error(error);
            toast.error(`Proses gagal`);
        }
    }

    const handleDelete = async(id)=>{
        const token = localStorage.getItem("token");
        if(window.confirm("Yakin ingin mengahpus jadwal ini?")){
            try{
                await axios.delete(`http://localhost:3000/admin/jadwal/delete/${id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                toast.success(`Jadwal berhasil dihapus`);
                fetchDataJadwal();
            }catch(error){
                console.error(error)
                toast.error(`Jadwal gagal dihapus`);
            }
        }
    }

    const [filterDepartemen, setFilterDepartemen] = useState("");
    const [openDepartemen, setOpenDepartemen] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editingJadwal, setEditingJadwal] = useState(null);
    const [jadwalData, setJadwalData] = useState([]);
    const [periodeKosong, setPeriodeKosong] = useState("")
    const [dataPeserta, setDataPeserta] = useState([])

    // State form jadwal
    const [formJadwal, setFormJadwal] = useState({
        instansi: "",
        id_peserta_magang: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
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

// Filter jadwal berdasarkan departemen dan kata kunci pencarian
const jadwalFiltered = jadwalData.filter((j) => {
    const matchDepartemen = filterDepartemen ? j.bidang === filterDepartemen : true;

    const nama = j.nama ? j.nama.toLowerCase() : "";
    const instansi = j.instansi ? j.instansi.toLowerCase() : "";
    const keyword = searchTerm.toLowerCase();

    const matchSearch = nama.includes(keyword) || instansi.includes(keyword);
    return matchDepartemen && matchSearch;
});

    // List departemen unik dari jadwal
    const departemenList = [...new Set(jadwalData.map((j) => j.bidang))];

    // Grouping jadwal per departemen
    const jadwalPerDepartemen = jadwalFiltered.reduce((acc, item) => {
        if (!acc[item.bidang]) acc[item.bidang] = [];
        acc[item.bidang].push(item);
        return acc;
    }, {});

    const toggleDepartemen = (departemen) => {
        setOpenDepartemen((prev) => ({
        ...prev,
        [departemen]: !prev[departemen],
        }));
    };
    //mendapatkan periode magang dari fetchDataPeserta
    const periodeFiltered = formJadwal.instansi
        ? dataPeserta.find((p) => p.id_peserta_magang === parseInt(formJadwal.id_peserta_magang))
        : null;

    useEffect(() => {
        const initialState = {};
        Object.keys(jadwalPerDepartemen).forEach((departemen) => {
        initialState[departemen] = true;
        });
        setOpenDepartemen(initialState);
    }, [jadwalData,filterDepartemen]);

    // Ambil peserta sesuai instansi dipilih
    const pesertaFiltered = formJadwal.instansi
        ? dataPeserta.filter((p) => p.instansi === formJadwal.instansi)
        : [];

    return (
        <div className="app-layout">
        <SidebarAdmJd />
        <div className="content-area">
            <NavbarAdmJd onSearch={setSearchTerm}/>

            <section className="main">
                <div className="submain">
                <div className="submain-left">
                    <p className="judul-submain">Jadwal Penempatan Magang</p>
                    <button
                        className="btn-buat-jadwal"
                        onClick={() => {
                            setFormJadwal({
                            instansi: "",
                            id_peserta_magang: "",
                            tanggal_mulai: "",
                            tanggal_selesai: "",
                            departemen: "",
                            });
                            setEditingJadwal(null); 
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
                                <tr key={item.id_jadwal}>
                                <td>{idx + 1}</td>
                                <td>{item.nama}</td>
                                <td>{item.instansi}</td>
                                <td>{item.bidang}</td>
                                <td>{dayjs(item.tanggal_mulai).format("DD MMMM YYYY")}</td>
                                <td>{dayjs(item.tanggal_selesai).format("DD MMMM YYYY")}</td>
                                <td className="aksi-cell">
                                <div className="aksi-wrapper">
                                    <TbEdit
                                    style={{ cursor: "pointer", marginRight: "10px", fontSize: "22px" }}
                                    title="Edit Jadwal"
                                    onClick={() => {
                                        setFormJadwal({
                                            instansi: item.instansi,
                                            id_peserta_magang: item.id_peserta_magang,
                                            tanggal_mulai: dayjs(item.tanggal_mulai).format("YYYY-MM-DD"),
                                            tanggal_selesai: dayjs(item.tanggal_selesai).format("YYYY-MM-DD"),
                                            departemen: item.bidang,
                                        });
                                        setEditingJadwal(item); 
                                        setShowModal(true);
                                    }}
                                    />
                                    <MdDeleteOutline
                                    style={{ cursor: "pointer", color: "red", fontSize: "22px" }}
                                    title="Hapus Jadwal"
                                    onClick={() => handleDelete(item.id_jadwal)}
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
                    <div className="jadwal-detail-item">
                    <b>Instansi :</b>
                    <select
                        className="jadwal-input"
                        value={formJadwal.instansi}
                        onChange={(e) =>
                        setFormJadwal({ ...formJadwal, instansi: e.target.value, id_peserta_magang: "" })
                        }
                    >
                        <option value="">-- Pilih Instansi --</option>
                        {[...new Set(dataPeserta.map((p) => p.instansi))].map(
                        (inst, idx) => (
                            <option key={idx} value={inst}>
                            {inst}
                            </option>
                        )
                        )}
                    </select>
                    </div>

                    <div className="jadwal-detail-item">
                    <b>Peserta :</b>
                    <select
                        className="jadwal-input"
                        value={formJadwal.id_peserta_magang}
                        onChange={(e) =>
                        setFormJadwal({ ...formJadwal, id_peserta_magang: e.target.value })
                        }
                        disabled={!formJadwal.instansi}
                    >
                        <option value="">-- Pilih Peserta --</option>
                        {pesertaFiltered.map((p) => (
                        <option key={p.id_peserta_magang} value={p.id_peserta_magang}>
                            {p.nama}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div className="jadwal-detail-item">
                    <b>Periode Magang :</b>
                        <input
                        type="text"
                        className="jadwal-input"
                        placeholder="periode magang"
                        value={
                            periodeFiltered ? `${dayjs(periodeFiltered.tanggal_mulai_magang).format("DD MMMM YYYY")} - ${dayjs(periodeFiltered.tanggal_selesai_magang).format("DD MMMM YYYY")}`: ""
                        }
                        disabled
                        />
                    </div>

                    <div className="jadwal-detail-item">
                    <b>Tanggal Mulai Penempatan :</b>
                    <input
                        type="date"
                        className="jadwal-input"
                        value={formJadwal.tanggal_mulai}
                        min={periodeFiltered ? dayjs(periodeFiltered.tanggal_mulai_magang).format("YYYY-MM-DD") : ""}
                        max={periodeFiltered ? dayjs(periodeFiltered.tanggal_selesai_magang).format("YYYY-MM-DD") : ""}
                        onChange={(e) =>
                        setFormJadwal({ ...formJadwal, tanggal_mulai: e.target.value })
                        }
                        disabled={!periodeFiltered}
                    />
                    </div>

                    <div className="jadwal-detail-item">
                    <b>Tanggal Selesai Penempatan :</b>
                    <input
                        type="date"
                        className="jadwal-input"
                        value={formJadwal.tanggal_selesai}
                        min={periodeFiltered ? dayjs(periodeFiltered.tanggal_mulai_magang).format("YYYY-MM-DD") : ""}
                        max={periodeFiltered ? dayjs(periodeFiltered.tanggal_selesai_magang).format("YYYY-MM-DD") : ""}
                        onChange={(e) =>
                        setFormJadwal({ ...formJadwal, tanggal_selesai  : e.target.value })
                        }
                        disabled={!periodeFiltered}
                    />
                    </div>

                    <div className="jadwal-detail-item">
                    <b>Departemen Penempatan:</b>
                    <select
                        className="jadwal-input"
                        value={formJadwal.departemen}
                        onChange={(e) =>
                        setFormJadwal({ ...formJadwal, departemen: e.target.value })
                        }
                    >
                        <option value="">-- Pilih Departemen --</option>
                        {departemenStatic.filter((dept)=>{
                            const sudahAda = jadwalData.some((j)=>j.id_peserta_magang === parseInt(formJadwal.id_peserta_magang)&&j.bidang === dept)
                            return !sudahAda || dept === formJadwal.departemen;
                        }).map((dept, idx) => (
                        <option key={idx} value={dept}>
                            {dept}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div className="jadwal-modal-actions">
                        <button
                        className="btn-save"
                        onClick={handleSave}>
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
