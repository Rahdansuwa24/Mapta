// PAGE SELESAI MAGANG ADMIN
import React, { useEffect, useState } from "react";
import SidebarAdm from "../../components/sidebar-adm";
import NavbarAdm from "../../components/navbar-adm";
import { LuAlignJustify } from "react-icons/lu";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import "../../styles/dashboard.css";
import profil1 from "../../assets/images/profil1.jpg";
import dayjs from "dayjs";

const highlightText = (text, search) => {
  if (!search) return text;
  const parts = text.split(new RegExp(`(${search})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark key={i} style={{ backgroundColor: "#AFD3F6" }}>{part}</mark>
    ) : (
      part
    )
  );
};

function SelesaiMagang() {
    useEffect(() => {
        document.title = "Admin MAPTA";
    }, []);

    // dummy peserta selesai magang
    const pesertaDummy = [
        {
        id: 1,
        nama: "Budi Santoso",
        nim: "1234567890",
        instansi: "Politeknik Elektronika Negeri Surabaya",
        tglMulai: "01-09-2025",
        tglSelesai: "30-11-2025",
        kategori: "Individu",
        email: "budi.santoso@gmail.com",
        profil: profil1,
        status: "Selesai",
        departemen: "Bidang Teknologi Informasi",
        dokumen: ["Proposal.pdf"],
        surat: ["Surat_Penerimaan.pdf"],
        sertifikat: ["Sertifikat.pdf"],
        nilaiTeknis: [
            { aspek: "Kehadiran", skor: 90, huruf: "A" },
            { aspek: "Skill/Keahlian", skor: 85, huruf: "B+" },
            { aspek: "Kreatifitas", skor: 88, huruf: "B+" },
        ],
        nilaiNonTeknis: [
            { aspek: "Kerjasama", skor: 92, huruf: "A-" },
            { aspek: "Komunikasi", skor: 87, huruf: "B+" },
            { aspek: "Sikap/Etika", skor: 95, huruf: "A" },
        ],
        },
        {
        id: 2,
        nama: "Ahmad Ifcel",
        nim: "1122334455",
        instansi: "Universitas Airlangga",
        tglMulai: "05-09-2025",
        tglSelesai: "05-12-2025",
        kategori: "Kelompok",
        email: "ahmad.fauzi@gmail.com",
        profil: profil1,
        status: "Selesai",
        departemen: "Bidang Humas",
        dokumen: ["Proposal.pdf"],
        surat: ["Surat_Penolakan.pdf"],
        sertifikat: ["Sertifikat.pdf"],
        nilaiTeknis: [
            { aspek: "Penyusunan Laporan", skor: 80, huruf: "B+" },
            { aspek: "Analisis Data", skor: 82, huruf: "B+" },
        ],
        nilaiNonTeknis: [
            { aspek: "Kerja Sama Tim", skor: 86, huruf: "A-" },
            { aspek: "Etika Kerja", skor: 89, huruf: "A-" },
        ],
        },
        {
        id: 3,
        nama: "Ahmad Haidar",
        nim: "9988776655",
        instansi: "Universitas Negeri Surabaya",
        tglMulai: "10-09-2025",
        tglSelesai: "10-12-2025",
        kategori: "Individu",
        email: "haidar@gmail.com",
        profil: profil1,
        status: "Selesai",
        departemen: "Bidang Perpustakaan",
        dokumen: ["Proposal.pdf"],
        surat: ["Surat_Penerimaan.pdf"],
        sertifikat: ["Sertifikat.pdf"],
        nilaiTeknis: [
            { aspek: "Pengelolaan Arsip", skor: 87, huruf: "A-" },
            { aspek: "Digitalisasi Dokumen", skor: 90, huruf: "A" },
        ],
        nilaiNonTeknis: [
            { aspek: "Inisiatif", skor: 85, huruf: "A-" },
            { aspek: "Tanggung Jawab", skor: 91, huruf: "A" },
        ],
        },
    ];

    const [searchTerm, setSearchTerm] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [filterInstansi, setFilterInstansi] = useState("");
    const [openInstansi, setOpenInstansi] = useState({});

    const handleOpenModal = (peserta) => {
        setSelectedPeserta(peserta);
        setShowModal(true);
    };

const pesertaFiltered = pesertaDummy.filter((p) => {
  const matchInstansi = filterInstansi ? p.instansi === filterInstansi : true;

  const nama = p.nama ? p.nama.toLowerCase() : "";
  const instansi = p.instansi ? p.instansi.toLowerCase() : "";
  const tanggalMulai = p.tglMulai
    ? dayjs(p.tglMulai, "DD-MM-YYYY").format("DD MMMM YYYY").toLowerCase()
    : "";
  const tanggalSelesai = p.tglSelesai
    ? dayjs(p.tglSelesai, "DD-MM-YYYY").format("DD MMMM YYYY").toLowerCase()
    : "";

  const keyword = searchTerm.toLowerCase();

  const matchSearch =
    nama.includes(keyword) ||
    instansi.includes(keyword) ||
    tanggalMulai.includes(keyword) ||
    tanggalSelesai.includes(keyword);

  return matchInstansi && matchSearch;
});


    const instansiList = [...new Set(pesertaDummy.map((p) => p.instansi))];

    const pesertaPerInstansi = pesertaFiltered.reduce((acc, peserta) => {
        if (!acc[peserta.instansi]) acc[peserta.instansi] = [];
        acc[peserta.instansi].push(peserta);
        return acc;
    }, {});

    const toggleInstansi = (instansi) => {
        setOpenInstansi((prev) => ({
        ...prev,
        [instansi]: !prev[instansi],
        }));
    };

    useEffect(() => {
        const initialState = {};
        Object.keys(pesertaPerInstansi).forEach((instansi) => {
        initialState[instansi] = true;
        });
        setOpenInstansi(initialState);
    }, [filterInstansi]);

    return (
        <div className="app-layout">
        <SidebarAdm />
        <div className="content-area">
            <NavbarAdm onSearch={setSearchTerm}/>
            <section className="main">
            <div className="submain">
                <p className="judul-submain">Daftar Peserta Selesai Magang</p>
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

            {Object.keys(pesertaPerInstansi).map((instansi) => {
                const pesertaInstansi = pesertaPerInstansi[instansi];
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
                        <p>{instansi}</p>
                    </div>
                    </div>

                    <div
                    className={`contain-table-wrapper ${
                        openInstansi[instansi] ? "open" : "closed"
                    } ${!openInstansi[instansi] ? "with-gap" : ""}`}
                    >
                    <div className="contain-table">
                        <div className="table-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Instansi</th>
                                <th>Tgl Mulai</th>
                                <th>Tgl Selesai</th>
                                <th>Kategori</th>
                                <th>Status</th>
                                <th>Detail Profil</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pesertaInstansi.map((peserta, idx) => (
                                <tr key={peserta.id}>
                                <td>{idx + 1}</td>
                                <td className="nama-cell">
                                    <img src={peserta.profil} alt="Foto Profil" />
                                    <span>{highlightText(peserta.nama, searchTerm)}</span>
                                </td>
                                <td>{highlightText(peserta.instansi, searchTerm)}</td>
                                <td>{peserta.tglMulai}</td>
                                <td>{peserta.tglSelesai}</td>
                                <td>{peserta.kategori}</td>
                                <td>
                                    <span className="status-label selesai">
                                    {peserta.status}
                                    </span>
                                </td>
                                <td className="aksi-cell">
                                    <div className="aksi-wrapper">
                                    <FaEllipsisVertical
                                        style={{ cursor: "pointer" }}
                                        title="Detail Profil"
                                        onClick={() => handleOpenModal(peserta)}
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

            {showModal && selectedPeserta && (
            <div className="overlay" onClick={() => setShowModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span>Detail Peserta</span>
                    <div className="close-btn" onClick={() => setShowModal(false)}>
                    <FaTimes />
                    </div>
                </div>

                <div className="modal-body">
                    {/* Data Peserta */}
                    <div className="profile-pic">
                    <img
                        src={selectedPeserta.profil}
                        alt="Profil"
                        style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "10px",
                        }}
                    />
                    </div>
                    <div className="detail-item">
                    <b>Nama :</b>
                    <p>{selectedPeserta.nama}</p>
                    </div>
                    <div className="detail-item">
                    <b>NIM/NIP :</b>
                    <p>{selectedPeserta.nim}</p>
                    </div>
                    <div className="detail-item">
                    <b>Instansi :</b>
                    <p>{selectedPeserta.instansi}</p>
                    </div>
                    <div className="detail-item">
                    <b>Tanggal Mulai - Tanggal Selesai :</b>
                    <p>
                        {selectedPeserta.tglMulai} hingga {selectedPeserta.tglSelesai}
                    </p>
                    </div>
                    <div className="detail-item">
                    <b>Kategori :</b>
                    <p>{selectedPeserta.kategori}</p>
                    </div>
                    <div className="detail-item">
                    <b>Email :</b>
                    <p>{selectedPeserta.email}</p>
                    </div>
                    <div className="detail-item">
                    <b>Status :</b>
                    <p>
                        <span className="status-label selesai">
                        {selectedPeserta.status}
                        </span>
                    </p>
                    </div>

                    {/* Dokumen */}
                    <div className="detail-item">
                    <b>Dokumen :</b>
                    <div className="dokumen-list">
                        {selectedPeserta.dokumen.length > 0 ? (
                        selectedPeserta.dokumen.map((doc, index) => (
                            <div className="dokumen-item" key={index}>
                            <span>{doc}</span>
                            <div className="dokumen-actions">
                                <button className="btn-download">Download</button>
                            </div>
                            </div>
                        ))
                        ) : (
                        <p>Tidak ada dokumen</p>
                        )}
                    </div>
                    </div>

                    {/* Surat */}
                    <div className="detail-item">
                    <b>Surat Penerimaan/Penolakan :</b>
                    <div className="dokumen-list">
                        {selectedPeserta.surat.length > 0 ? (
                        selectedPeserta.surat.map((doc, index) => (
                            <div className="dokumen-item" key={index}>
                            <span>{doc}</span>
                            <div className="dokumen-actions">
                                <button className="btn-download">Download</button>
                            </div>
                            </div>
                        ))
                        ) : (
                        <p>Tidak ada surat</p>
                        )}
                    </div>
                    </div>

                    {/* Sertifikat */}
                    <div className="detail-item">
                    <b>Sertifikat :</b>
                    <div className="dokumen-list">
                        {selectedPeserta.sertifikat.length > 0 ? (
                        selectedPeserta.sertifikat.map((doc, index) => (
                            <div className="dokumen-item" key={index}>
                            <span>{doc}</span>
                            <div className="dokumen-actions">
                                <button className="btn-download">Download</button>
                            </div>
                            </div>
                        ))
                        ) : (
                        <p>Tidak ada sertifikat</p>
                        )}
                    </div>
                    </div>

                    {/* ===== TABEL NILAI ===== */}
                    <div className="nilai-modal-body">
                    <span>Data Nilai :</span>
                    <div className="nilai-subjudul">
                        <p>
                        {selectedPeserta.departemen} (
                            {/* INI KUKASIH FUNGSI DARI TGLMULAI UNTUK PERCOBAAN, 
                            SEHARUSNYA DISESUAIKAN DARI PENEMPATAN JADWAL PER BIDANGNYA
                            */}
                        {selectedPeserta.tglMulai} hingga {selectedPeserta.tglSelesai})
                        </p>
                    </div>

                    {/* ASPEK TEKNIS */}
                    <div className="nilai-section">
                        <h4>Aspek Teknis</h4>
                        <table className="nilai-table">
                        <thead>
                            <tr>
                            <th>No</th>
                            <th>Aspek Yang Dinilai</th>
                            <th>Nilai Angka</th>
                            <th>Nilai Huruf</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPeserta?.nilaiTeknis?.map((item, i) => (
                            <tr key={`teknis-${i}`}>
                                <td>{i + 1}</td>
                                <td>{item.aspek}</td>
                                <td>{item.skor}</td>
                                <td>{item.huruf}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>

                    {/* ASPEK NON TEKNIS */}
                    <div className="nilai-section">
                        <h4>Aspek Non Teknis</h4>
                        <table className="nilai-table">
                        <thead>
                            <tr>
                            <th>No</th>
                            <th>Aspek Yang Dinilai</th>
                            <th>Nilai Angka</th>
                            <th>Nilai Huruf</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPeserta?.nilaiNonTeknis?.map((item, i) => (
                            <tr key={`nonteknis-${i}`}>
                                <td>{i + 1}</td>
                                <td>{item.aspek}</td>
                                <td>{item.skor}</td>
                                <td>{item.huruf}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    );
}

export default SelesaiMagang;
