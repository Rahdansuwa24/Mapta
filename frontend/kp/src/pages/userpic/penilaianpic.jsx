// PAGE PENILAIAN PIC

import React, { useEffect, useState } from "react";
import SidebarUsr from "../../components/sidebar-user";
import NavbarUsr from "../../components/navbar-user";
import { LuAlignJustify } from "react-icons/lu";
import { FaTimes, FaTrash } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { BiSolidCalendar } from "react-icons/bi";
import { RiBallPenFill } from "react-icons/ri";
import axios from 'axios'
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

import "../../styles/user.css";

function PenilaianPic() {
    useEffect(() => {
        document.title = "Penilaian PIC";
        fetchDataPesertaPerInstansi()
        fetchDataAspek()
        fetchNilai()
    }, []);


    const fetchDataPesertaPerInstansi = async()=>{
        const token = localStorage.getItem("token")
        try{
            const res = await axios.get("http://localhost:3000/pic/penilaian/peserta", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            const dataPeserta = res.data.dataPic
            setFetcDataPeserta(dataPeserta)
        }catch(error){
            console.error(error)
            alert("gagal fetch data")
        }
    }

    const fetchDataAspek = async()=>{
        const token = localStorage.getItem("token")
        try{
            const res = await axios.get("http://localhost:3000/pic/penilaian/aspek", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            setAspekTeknisList(res.data.dataAspek.filter(a=>a.aspek === "teknis"))
            setAspekNonTeknisList(res.data.dataAspek.filter(a=>a.aspek === "non-teknis"))
        }catch(error){
            console.error(error)
            alert("gagal fetch data")
        }
    }

    const fetchNilai = async()=>{
        const token = localStorage.getItem("token")
        try{
            const res = await axios.get("http://localhost:3000/pic/penilaian", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data.dataPenilaian)
            const data = res.data.dataPenilaian.map((item)=>{

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
                nama: a,
                nilai: nilaiTeknisArr[i] || 0,
            }));

            const aspekNonTeknis = aspekNonTeknisArr.map((a, i) => ({
                id_aspek: idAspekNonTeknisArr[i] || null,
                id_penilaian: idPenilaianNonTeknisArr[i] || null,
                nama: a,
                nilai: nilaiNonTeknisArr[i] || 0,
            }));


            return {
                ...item,
                aspekTeknis,
                aspekNonTeknis,
            };

        })
            setDataPesertaHome(data)
        }catch(error){
            console.error(error)
            alert("gagal fetch data")
        }
    }

    const [filterInstansi, setFilterInstansi] = useState("");
    const [openInstansi, setOpenInstansi] = useState({});
    const [showModal, setShowModal] = useState(false);

    const [selectedInstansi, setSelectedInstansi] = useState("");
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [nilaiAspek, setNilaiAspek] = useState({});
    const [isEdit, setIsEdit] = useState(false); // 🔑 mode tambah/edit
    const [fetchDataPeserta, setFetcDataPeserta] = useState([])
    const [aspekList, setAspekList] = useState([])
    const [aspekTeknisList, setAspekTeknisList] = useState([])
    const [aspekNonTeknisList, setAspekNonTeknisList] = useState([])
    const [DataPesertaHome, setDataPesertaHome] = useState([])

    // toggle instansi buka/tutup
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

    const instansiList = [...new Set(DataPesertaHome.map((item) => item.instansi))]

    const dataFiltered = filterInstansi
        ? groupedByInstansi(DataPesertaHome.filter((d) => d.instansi === filterInstansi))
        : groupedByInstansi(DataPesertaHome);

    useEffect(() => {
        const initState = {};
        instansiList.forEach((instansi) => (initState[instansi] = true));
        setOpenInstansi(initState);
    }, [filterInstansi, fetchDataPeserta]);

    const handleInputChange = (aspek, value) => {
        setNilaiAspek((prev) => ({
            ...prev,
            [aspek]: value,
        }));
    };

    const pesertaList = (selectedInstansi
        ? fetchDataPeserta.filter((d) => d.instansi === selectedInstansi)
        : fetchDataPeserta).map((p)=>{
            const found = DataPesertaHome.find((d)=> d.id_peserta_magang === p.id_peserta_magang)
            return{
                ...p,
                aspekTeknis: found?.aspekTeknis || [],
                aspekNonTeknis: found?.aspekNonTeknis || [],
            }
        });

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
    if (!selectedPeserta) return alert("Pilih peserta terlebih dahulu");
    if (Object.keys(nilaiAspek).length === 0) return alert("Isi minimal 1 nilai aspek!");

    const token = localStorage.getItem("token");

    try {
        // gabungkan semua aspek dengan nilai yang diinput user
        const aspekSemua = [
           ...aspekTeknisList.map(a => {
                const found = selectedPeserta.aspekTeknis.find(x => Number(x.id_aspek) === Number(a.id_aspek));
                return {
                    id_aspek: a.id_aspek,
                    id_penilaian: found ? Number(found.id_penilaian) : null,
                    nilai: nilaiAspek[a.id_aspek] !== undefined ? parseFloat(nilaiAspek[a.id_aspek]) : null,
                };
            }),
            ...aspekNonTeknisList.map(a => {
                const found = selectedPeserta.aspekNonTeknis.find(x => Number(x.id_aspek) === Number(a.id_aspek));
                return {
                    id_aspek: a.id_aspek,
                    id_penilaian: found ? parseInt(found.id_penilaian) : null,
                    nilai: nilaiAspek[a.id_aspek] !== undefined ? parseFloat(nilaiAspek[a.id_aspek]) : null,
                };
            })
        ];

        console.log("Aspek semua sebelum simpan:", aspekSemua);

        // hanya simpan aspek yang diisi user
        const requests = aspekSemua
            .filter(a => a.nilai !== null)
            .map(a => {
                if (a.id_penilaian) {
                    // update
                    return axios.patch(
                        `http://localhost:3000/pic/penilaian/update/${a.id_penilaian}`,
                        { penilaian: a.nilai },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } else {
                    // insert
                    return axios.post(
                        "http://localhost:3000/pic/penilaian/store",
                        {
                            id_aspek: a.id_aspek,
                            id_peserta_magang: selectedPeserta.id_peserta_magang,
                            penilaian: a.nilai
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }
            });

        await Promise.all(requests);

        alert("Nilai berhasil disimpan");
        fetchNilai();
        fetchDataPesertaPerInstansi();

        setShowModal(false);
        setNilaiAspek({});
        setSelectedPeserta(null);
        setSelectedInstansi("");
        setIsEdit(false);

    } catch (error) {
        console.error(error);
        alert("Gagal menyimpan data");
    }
};


    const handleDelete = async (peserta)=>{
        if(!window.confirm("Yakin ingin hapus nilai peserta?")) return
        const token = localStorage.getItem("token")

        try{
            await Promise.all(
                [...(peserta.aspekTeknis || []), ...(peserta.aspekNonTeknis || [])].map((a) =>
                    axios.delete(`http://localhost:3000/pic/penilaian/delete/${a.id_penilaian}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );
            setDataPesertaHome((prev) =>
                prev.map((p) =>
                    p.id_peserta_magang === peserta.id_peserta_magang
                        ? { ...p, aspekTeknis: [], aspekNonTeknis: [] }
                        : p
                )
            );

            alert("nilai peserta berhasil dihapus"); 
            fetchDataPesertaPerInstansi()
            fetchNilai()
        }catch(error){
            console.error(error);
            alert("gagal menghapus nilai");
        }
    }

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
                    { path: "/pic-jadwal", label: "Jadwal", icon: <BiSolidCalendar /> },
                    { path: "/pic-penilaian", label: "Penilaian", icon: <RiBallPenFill /> },
                ]}
                />
            <div className="jp-content-area">
                <NavbarUsr />

                <section className="jp-main">
                    <div className="jp-submain">
                        <div className="jp-submain-actions">
                            <p className="jp-judul-submain">Penilaian Peserta Magang</p>
                            <button
                                className="jp-btn-isi-nilai"
                                onClick={() => {
                                    setNilaiAspek({});
                                    setSelectedInstansi("");
                                    setSelectedPeserta(null);
                                    setIsEdit(false);
                                    setShowModal(true);
                                }}
                            >
                                Isi Nilai
                            </button>
                        </div>
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

                    {Object.entries(dataFiltered).map(([instansi, peserta]) => {
                        const isOpen = openInstansi[instansi];
                        return (
                            <div className="jp-container-instansi" key={instansi}>
                                <div className="jp-instansi-header">
                                    <LuAlignJustify
                                        size={25}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => toggleInstansi(instansi)}
                                    />
                                    <div className="jp-teks-instansi">
                                        <p>Instansi</p>
                                        <p>{instansi}</p>
                                    </div>
                                </div>

                                <div
                                    className={`jp-contain-table-wrapper ${isOpen ? "open" : "closed"} ${
                                        !isOpen ? "jp-with-gap" : ""
                                    }`}
                                >
                                    {peserta.map((p) => (
                                        <div className="jp-penilaian-card" key={p.id_peserta_magang}>
                                            <div className="jp-penilaian-header">
                                                <span>{p.nama}</span>
                                                <div className="jp-penilaian-actions">
                                                    <span
                                                      onClick={() => {
                                                            // Ambil peserta dari DataPesertaHome
                                                            const pesertaDetail = DataPesertaHome.find(d => d.id_peserta_magang === p.id_peserta_magang);

                                                            const aspekTeknis = pesertaDetail.aspekTeknis?.map(a => ({
                                                                id_aspek: parseInt(a.id_aspek),
                                                                id_penilaian: a.id_penilaian ? parseInt(a.id_penilaian) : null,
                                                                nilai: a.nilai ?? "",
                                                                nama: a.nama,
                                                            })) || [];

                                                            const aspekNonTeknis = pesertaDetail.aspekNonTeknis?.map(a => ({
                                                                id_aspek: parseInt(a.id_aspek),
                                                                id_penilaian: a.id_penilaian ? parseInt(a.id_penilaian) : null,
                                                                nilai: a.nilai ?? "",
                                                                nama: a.nama,
                                                            })) || [];

                                                            setSelectedInstansi(p.instansi);
                                                            setSelectedPeserta({
                                                                ...pesertaDetail,
                                                                aspekTeknis,
                                                                aspekNonTeknis
                                                            });

                                                            const nilai = {};
                                                             [...aspekTeknis, ...aspekNonTeknis].forEach(a => {
                                                                nilai[parseInt(a.id_aspek)] = a.nilai;
                                                            });
                                                            setNilaiAspek(nilai);
                                                            setIsEdit(true);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <TbEdit
                                                            style={{ fontSize: "20px" }}
                                                            className="jp-icon-edit"
                                                        />{" "}
                                                        edit
                                                    </span>
                                                    <span onClick={()=>handleDelete(p)}>
                                                        <FaTrash className="jp-icon-trash" /> hapus
                                                    </span>
                                                </div>
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
                                                            {(p.aspekTeknis?.length || 0) === 0 ? (
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
                                                            {(p.aspekNonTeknis?.length || 0) === 0 ? (
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
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* Modal isi/edit nilai */}
                {showModal && (
                    <div className="jp-overlay" onClick={() => setShowModal(false)}>
                        <div className="jp-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="jp-modal-header">
                                <span>{isEdit ? "Edit Nilai Peserta" : "Isi Nilai Peserta"}</span>
                                <div className="jp-close-btn" onClick={() => setShowModal(false)}>
                                    <FaTimes />
                                </div>
                            </div>

                            <div className="jp-modal-body">
                                {/* Dropdown Instansi */}
                                <select
                                    value={selectedInstansi}
                                    onChange={(e) => {
                                        setSelectedInstansi(e.target.value);
                                        setSelectedPeserta(null);
                                        setNilaiAspek({});
                                    }}
                                    disabled={isEdit} /* INI DISABLE DROPDOWN INSTANSI JIKA DIEDIT */
                                >
                                    <option value="">Pilih Instansi</option>
                                   {[...new Set(fetchDataPeserta.map((item) => item.instansi))].map(
                                        (instansi, idx) => (
                                        <option key={idx} value={instansi}>
                                            {instansi}
                                        </option>
                                        )
                                    )}
                                </select>

                                {/* Dropdown Peserta */}
                                <select
                                    value={selectedPeserta?.id_peserta_magang || ""}
                                    onChange={(e) => {
                                        const peserta = filteredPesertaList.find(
                                            (p) => p.id_peserta_magang === parseInt(e.target.value)
                                        );
                                        setSelectedPeserta(peserta);

                                        if (peserta) {
                                            const nilai = {};
                                            (peserta.aspekTeknis || []).forEach((a) => (nilai[a.id_aspek] = a.nilai));
                                            (peserta.aspekNonTeknis || []).forEach((a) => (nilai[a.id_aspek] = a.nilai));
                                            setNilaiAspek(nilai);
                                        } else {
                                            setNilaiAspek({});
                                        }
                                    }}
                                    disabled={!selectedInstansi || isEdit} /* INI DISABLE DROPDOWN NAMA PESERTA JIKA DIEDIT */
                                >
                                    <option value="">Pilih Peserta</option>
                                    {filteredPesertaList.map((p) => (
                                        <option key={p.id_peserta_magang} value={p.id_peserta_magang}>
                                            {p.nama}
                                        </option>
                                    ))}
                                </select>

                                {/* Foto profil */}
                                {selectedPeserta && (
                                    <div className="jp-profile-pic">
                                        <img src={`http://localhost:3000/static/images/${selectedPeserta.foto_diri}`} alt="profil" />
                                    </div>
                                )}

                                {/* Aspek Teknis */}
                                <p style={{ fontStyle: "italic", fontWeight: 500 }}>Aspek Teknis</p>
                                {aspekTeknisList.map((a) => (
                                    <div key={a.id_aspek} className="jp-aspek-item">
                                        <span>{a.subjek}</span>
                                        <input
                                            type="number"
                                            placeholder="Nilai"
                                            value={nilaiAspek[a.id_aspek] || ""}
                                            onChange={(e) => handleInputChange(a.id_aspek, e.target.value)}
                                        />
                                    </div>
                                ))}

                                {/* Aspek Non Teknis */}
                                <p style={{ fontStyle: "italic", fontWeight: 500 }}>Aspek Non Teknis</p>
                                {aspekNonTeknisList.map((a) => (
                                    <div key={a.id_aspek} className="jp-aspek-item">
                                        <span>{a.subjek}</span>
                                        <input
                                            type="number"
                                            placeholder="Nilai"
                                            value={nilaiAspek[a.id_aspek] || ""}
                                            onChange={(e) => handleInputChange(a.id_aspek, e.target.value)}
                                        />
                                    </div>
                                ))}

                                <button className="jp-btn-simpan" onClick={handleSave}>
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

export default PenilaianPic;
