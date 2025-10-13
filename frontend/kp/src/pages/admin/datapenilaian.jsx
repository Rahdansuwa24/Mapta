// PAGE DATA PENILAIAN ASPEK

import React, { useEffect, useState } from "react";
import SidebarUsr from "../../components/sidebar-adm";
import NavbarUsr from "../../components/navbar-adm";
import { LuAlignJustify } from "react-icons/lu";
import { FaTimes, FaTrash } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import axios from 'axios'
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

import "../../styles/dashboard.css";
import "../../styles/datanilaiaspek.css";

import profil1 from "../../assets/images/profil1.jpg";
import profil2 from "../../assets/images/profil2.jpeg";

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

function DataPenilaianAspek() {
    useEffect(() => {
        document.title = "Admin MAPTA";
        fetchNilaiAdmin()
    }, []);

    const fetchNilaiAdmin = async()=>{
        const token = localStorage.getItem(("token"))
        try{
            const res = await axios.get("http://localhost:3000/admin/penilaian", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }) 
            const data = res.data.data.map((item)=>{
                    //mapping teknis
                    const aspekTeknisArr = item.aspek_teknis?item.aspek_teknis.split(", "): []
                    const nilaiTeknisArr = item.nilai_teknis?item.nilai_teknis.split(", ").map(Number): []
                    const idPenilaianTeknisArr = item.id_penilaian_teknis?item.id_penilaian_teknis.split(", ").map(x=>parseInt(x.trim())): []
                    const idAspekTeknisArr = item.id_aspek_teknis?item.id_aspek_teknis.split(", ").map(x=>parseInt(x.trim())): []
                    const bidangTeknissArr = item.bidang_teknis ? item.bidang_teknis.split(" || ") : [];

                    //maping non-teknis
                    const aspekNonTeknisArr = item.aspek_non_teknis?item.aspek_non_teknis.split(", "): []
                    const nilaiNonTeknisArr = item.nilai_non_teknis?item.nilai_non_teknis.split(", ").map(Number): []
                    const idPenilaianNonTeknisArr = item.id_penilaian_non_teknis?item.id_penilaian_non_teknis.split(", ").map(x=>parseInt(x.trim())):[]
                    const idAspekNonTeknisArr = item.id_aspek_non_teknis?item.id_aspek_non_teknis.split(", ").map(x=>parseInt(x.trim())): []
                    const bidangNonTeknisArr = item.bidang_non_teknis ? item.bidang_non_teknis.split(" || ") : [];

                    //contructuring array
                    const semuaData = [
                        ...aspekTeknisArr.map((a, i)=>({
                            id_aspek: idAspekTeknisArr[i] || null,
                            id_penilaian: idPenilaianTeknisArr[i] || null,
                            nama: a,
                            nilai: nilaiTeknisArr[i] ?? null,
                            bidang: bidangTeknissArr[i] || "-",
                            jenis: "teknis"
                        })),
                        ...aspekNonTeknisArr.map((a, i)=>({
                            id_aspek: idAspekNonTeknisArr[i] || null,
                            id_penilaian: idPenilaianNonTeknisArr[i] || null,
                            nama: a,
                            nilai: nilaiNonTeknisArr[i] ?? null,
                            bidang: bidangNonTeknisArr[i] || "-",
                            jenis: "non-teknis"
                        }))
                    ]

                    const groupedByBidang = semuaData.reduce((acc, curr) => {
                        if (!acc[curr.bidang]) acc[curr.bidang] = { teknis: [], nonTeknis: [] };
                        if (curr.jenis === "teknis") acc[curr.bidang].teknis.push(curr);
                        else acc[curr.bidang].nonTeknis.push(curr);
                        return acc;
                    }, {});
                    const aspekTeknis = semuaData.filter(a => a.jenis === "teknis");
                    const aspekNonTeknis = semuaData.filter(a => a.jenis === "non-teknis");
                    return{
                        ...item,
                        groupedByBidang,
                        aspekNonTeknis,
                        aspekTeknis
                    }
            })
            setDataNilaPeserta(data)
        }catch(err){
            alert("gagal fetch data")
        }
    }
    const [filterInstansi, setFilterInstansi] = useState("");
    const [openInstansi, setOpenInstansi] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [aspekTeknisList, setAspekTeknisList] = useState([])
    const [aspekNonTeknisList, setAspekNonTeknisList] = useState([])
    const [selectedInstansi, setSelectedInstansi] = useState("");
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [nilaiAspek, setNilaiAspek] = useState({});
    const [dataNilaiPeserta, setDataNilaPeserta] = useState([])
    const [isEdit, setIsEdit] = useState(false);
    const [departemenList, setDepartemenList] = useState([])
    const [aspekVisibility, setAspekVisibility] = useState(() => {
           const saved = localStorage.getItem("aspekVisibility");
           return saved ? JSON.parse(saved) : {};
    });

    const [searchTerm, setSearchTerm] = useState("");

    const toggleInstansi = (instansi) => {
        setOpenInstansi((prev) => ({
            ...prev,
            [instansi]: !prev[instansi],
        }));
    };

    const groupedByInstansi = (list) => {
    return list.reduce((acc, item) => {
            if (!acc[item.instansi]) {
                acc[item.instansi] = [];
            }
            acc[item.instansi].push(item);
            return acc;
        }, {});
    };

    const instansiList = [...new Set(dataNilaiPeserta.map((item) => item.instansi))]
// 🔹 Filter berdasarkan kata di search bar (nama atau instansi)
const dataFilteredSearch = dataNilaiPeserta.filter(
  (item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.instansi.toLowerCase().includes(searchTerm.toLowerCase())
);

// 🔹 Lanjutkan filter instansi kalau kamu punya dropdown instansi
const dataFiltered = filterInstansi
  ? groupedByInstansi(
      dataFilteredSearch.filter((d) => d.instansi === filterInstansi)
    )
  : groupedByInstansi(dataFilteredSearch);


    useEffect(() => {
            localStorage.setItem("aspekVisibility", JSON.stringify(aspekVisibility));
    }, [aspekVisibility]);

    useEffect(() => {
        const initState = {};
        instansiList.forEach((instansi) => (initState[instansi] = true));
        setOpenInstansi(initState);
    }, [filterInstansi, dataNilaiPeserta]);

    const handleInputChange = (key, value) => {
        setNilaiAspek((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const toggleAspekVisibility = (namaAspek) => {
        setAspekVisibility((prev) => ({
        ...prev,
        [namaAspek]: !prev[namaAspek],
        }));
    };

    const pesertaList = (selectedInstansi
        ? dataNilaiPeserta.filter((d) => d.instansi === selectedInstansi)
        : dataNilaiPeserta);

    const filteredPesertaList = pesertaList.filter((p) => {
        if (isEdit) {
            return true
        }else{
            const belumAdaAspek =
            (p.aspekTeknis?.length || 0) === 0 &&
            (p.aspekNonTeknis?.length || 0) === 0;
        return belumAdaAspek && p.instansi === selectedInstansi;
        }

    });

    const handleSave = async () => {
        if (Object.keys(nilaiAspek).length === 0) return alert("Isi minimal 1 nilai aspek!");
        const token = localStorage.getItem("token");

        try{
             const aspekSemua = Object.values(selectedPeserta.groupedByBidang)
            .flatMap(bidang => [...bidang.teknis, ...bidang.nonTeknis])
            .map(a => {
                const key = a.id_penilaian
                ? a.id_penilaian
                : `${a.id_aspek}-${selectedPeserta.id_peserta_magang}`;
                return {
                id_aspek: a.id_aspek,
                id_penilaian: a.id_penilaian || null,
                nilai:
                    nilaiAspek[key] !== undefined
                    ? parseFloat(nilaiAspek[key])
                    : null,
                };
            });
            console.log(aspekSemua)

            await Promise.all(
                aspekSemua.map((a) => {
                    if (a.id_penilaian) {
                        return axios.patch(
                            `http://localhost:3000/admin/penilaian/update/${a.id_penilaian}`,
                            { penilaian: a.nilai ?? null },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                    }
                    return null;
                })
            );
            alert("Nilai berhasil diperbarui");
            fetchNilaiAdmin();
        }catch(error){
            console.error(error);
            alert("Gagal update nilai");
        }

        setShowModal(false);
        setNilaiAspek({});
        setSelectedPeserta(null);
        setSelectedInstansi("");
        setIsEdit(false);
    };

    // const handleDeleteAspekDepartemen = async()=>{

    // }
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
         const validNilai = list
        .map(item => parseFloat(item.nilai))
        .filter(n => !isNaN(n));
        if (validNilai.length === 0) return { nilai: "-", indeks: "-" };
        const total = validNilai.reduce((acc, cur) => acc + cur, 0);
        const rataNilai = (total / validNilai.length).toFixed(2);
        const rataIndeks = hitungIndeksHuruf(rataNilai);
        return { nilai: rataNilai, indeks: rataIndeks };
    };

    return (
        <div className="app-layout">
            <SidebarUsr />
            <div className="content-area">
                <NavbarUsr onSearch={setSearchTerm} />

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

                    {Object.entries(dataFiltered).map(([instansi, peserta]) => {
                        const isOpen = openInstansi[instansi];
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
                                        <p>{highlightText(instansi, searchTerm)}</p>
                                    </div>
                                </div>

                                <div
                                    className={`contain-table-wrapper ${isOpen ? "open" : "closed"} ${
                                        !isOpen ? "with-gap" : ""
                                    }`}
                                >
                                    {peserta.map((p) => (
                                        <div className="dp-penilaian-card" key={p.id_peserta_magang}>
                                            <div className="dp-penilaian-header">
                                                <span>{highlightText(p.nama, searchTerm)}</span>
                                                <div className="dp-penilaian-actions">
                                                    <span
                                                        onClick={() => {
                                                            const pesertaDetail = dataNilaiPeserta.find(d => d.id_peserta_magang === p.id_peserta_magang);

                                                            const departemenList = Object.keys(pesertaDetail.groupedByBidang);
                                                            setDepartemenList(departemenList);

                                                            const semuaAspek = departemenList.flatMap((bidang) => [
                                                                ...pesertaDetail.groupedByBidang[bidang].teknis,
                                                                ...pesertaDetail.groupedByBidang[bidang].nonTeknis,
                                                            ]);
                                                           
                                                            const nilai = {};
                                                            semuaAspek.forEach((a) => {
                                                                const key = a.id_penilaian || `${a.id_aspek}-${p.id_peserta_magang}`;
                                                                nilai[key] = a.nilai;
                                                            });
                                                            setNilaiAspek(nilai);
                                                            setSelectedPeserta(pesertaDetail);
                                                            setSelectedInstansi(p.instansi);
                                                            setShowModal(true);
                                                            setIsEdit(true);
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
                                                            {(p.aspekTeknis?.length || 0) === 0 ? (
                                                                <tr>
                                                                    <td colSpan={4}>Belum ada nilai</td>
                                                                </tr>
                                                            ) : (
                                                                <>
                                                                    {p.aspekTeknis.filter(a => a.nilai !== null && !isNaN(a.nilai)).map((a, i) => (
                                                                        <tr key={i}>
                                                                            <td>{i + 1}</td>
                                                                            <td>{a.nama}</td>
                                                                            <td>{a.nilai !== null && !isNaN(a.nilai) ? a.nilai : "-"}</td>
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
                                                            {(p.aspekNonTeknis?.length || 0) === 0 ? (
                                                                <tr>
                                                                    <td colSpan={4}>Belum ada nilai</td>
                                                                </tr>
                                                            ) : (
                                                                <>
                                                                    {p.aspekNonTeknis.filter(a => a.nilai !== null && !isNaN(a.nilai)).map((a, i) => (
                                                                        <tr key={i}>
                                                                            <td>{i + 1}</td>
                                                                            <td>{a.nama}</td>
                                                                            <td>{a.nilai !== null && !isNaN(a.nilai) ? a.nilai : "-"}</td>
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
                                    value={selectedPeserta?.id_peserta_magang || ""}
                                    onChange={(e) => {
                                        const peserta = pesertaList.find(
                                            (p) => p.id_peserta_magang === parseInt(e.target.value)
                                        );
                                        setSelectedPeserta(peserta);

                                        if (peserta) {
                                            const nilai = {};
                                            peserta.aspekTeknis.forEach((a) => {
                                                const key = a.id_penilaian || `${a.id_aspek}-${peserta.id_peserta_magang}`;
                                                nilai[key] = a.nilai;
                                            });
                                            peserta.aspekNonTeknis.forEach((a) => {
                                                const key = a.id_penilaian || `${a.id_aspek}-${peserta.id_peserta_magang}`;
                                                nilai[key] = a.nilai;
                                            });
                                            setNilaiAspek(nilai);
                                        } else {
                                            setNilaiAspek({});
                                        }
                                    }}
                                    disabled={!selectedInstansi || isEdit}
                                >
                                    <option value="">Pilih Peserta</option>
                                    {filteredPesertaList.map((p) => (
                                        <option key={p.id_peserta_magang} value={p.id_peserta_magang}>
                                            {p.nama}
                                        </option>
                                    ))}
                                </select>

                                {selectedPeserta && (
                                    <div className="dp-profile-pic">
                                        <img src={`http://localhost:3000/static/images/${selectedPeserta.foto_diri}`} alt="profil" />
                                    </div>
                                )}

                                {departemenList.map((bidang) => (
                                <div key={bidang}>
                                    <h4 style={{ marginTop: "10px" }}>{bidang}</h4>

                                    <p style={{ fontStyle: "italic", fontWeight: 500 }}>Aspek Teknis</p>
                                    {selectedPeserta.groupedByBidang[bidang].teknis.length === 0 ? (
                                    <p>Tidak ada aspek teknis</p>
                                    ) : (
                                    selectedPeserta.groupedByBidang[bidang].teknis.map((a) => {
                                        const key = a.id_penilaian || `${a.id_aspek}-${selectedPeserta.id_peserta_magang}`;
                                        return (
                                        <div key={`teknis-${key}`} className="dp-aspek-item">
                                            <span>{a.nama}</span>
                                            <input
                                            type="number"
                                            placeholder="Nilai"
                                            value={nilaiAspek[key] || ""}
                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                            />
                                        </div>
                                        );
                                    })
                                    )}

                                    <p style={{ fontStyle: "italic", fontWeight: 500 }}>Aspek Non Teknis</p>
                                    {selectedPeserta.groupedByBidang[bidang].nonTeknis.length === 0 ? (
                                    <p>Tidak ada aspek non teknis</p>
                                    ) : (
                                    selectedPeserta.groupedByBidang[bidang].nonTeknis.map((a) => {
                                        const key = a.id_penilaian || `${a.id_aspek}-${selectedPeserta.id_peserta_magang}`;
                                        return (
                                        <div key={`nonteknis-${key}`} className="dp-aspek-item">
                                            <span>{a.nama}</span>
                                            <input
                                            type="number"
                                            placeholder="Nilai"
                                            value={nilaiAspek[key] || ""}
                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                            />
                                        </div>
                                        );
                                    })
                                    )}
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
