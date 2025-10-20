// PAGE SELESAI MAGANG ADMIN
import React, { useEffect, useState } from "react";
import SidebarAdm from "../../components/sidebar-adm";
import NavbarAdm from "../../components/navbar-adm";
import { LuAlignJustify } from "react-icons/lu";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import "../../styles/dashboard.css";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

const highlightText = (text, search) => {
  if (!search) return text;
  const parts = text.split(new RegExp(`(${search})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark key={i} style={{ backgroundColor: "#AFD3F6" }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
};

function SelesaiMagang() {
  useEffect(() => {
    document.title = "Admin MAPTA";
    fetchDataNilaiFinal();
  }, []);

  const parseEntries = (str, type = "teknis") => {
    if (!str) return [];
    return str.split(" || ").map((s) => {
      const parts = s.split("::").map((p) => p?.trim());
      return {
        type,
        bidang: parts[0] || "-",
        aspek: parts[1] || "-",
        nilai:
          parts[2] === undefined || parts[2] === "null"
            ? null
            : isNaN(parts[2])
            ? parts[2]
            : Number(parts[2]),
      };
    });
  };

  const parseJadwal = (str) => {
    if (!str) return {};
    return str.split(" || ").reduce((acc, s) => {
      const [bidang, tmulai, tsls] = s.split("::").map((p) => p?.trim());
      if (bidang)
        acc[bidang] = { tanggal_mulai: tmulai || null, tanggal_selesai: tsls || null };
      return acc;
    }, {});
  };

  const [dataFinal, setDataFinal] = useState([]);

  const fetchDataNilaiFinal = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:3000/admin/dasbor/final", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataFinal = res.data.data.map((item) => {
        const teknis = parseEntries(item.teknis_entries, "teknis");
        const nonteknis = parseEntries(item.nonteknis_entries, "non-teknis");
        const jadwalMap = parseJadwal(item.jadwal_per_bidang);

        const groupedByBidang = {};
        [...teknis, ...nonteknis].forEach((entry) => {
          const b = entry.bidang || "-";
          if (!groupedByBidang[b])
            groupedByBidang[b] = {
              teknis: [],
              nonTeknis: [],
              tanggal_mulai: null,
              tanggal_selesai: null,
            };
          if (entry.type === "teknis") groupedByBidang[b].teknis.push(entry);
          else groupedByBidang[b].nonTeknis.push(entry);

          if (jadwalMap[b]) {
            groupedByBidang[b].tanggal_mulai = jadwalMap[b].tanggal_mulai;
            groupedByBidang[b].tanggal_selesai = jadwalMap[b].tanggal_selesai;
          }
        });

        return {
          ...item,
          groupedByBidang,
        };
      });
      setDataFinal(dataFinal);
    } catch (error) {
      console.error(error);
      alert("Gagal fetch data");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [filterInstansi, setFilterInstansi] = useState("");
  const [openInstansi, setOpenInstansi] = useState({});

  const handleOpenModal = (peserta) => {
    setSelectedPeserta(peserta);
    setShowModal(true);
  };

  const pesertaFiltered = dataFinal.filter((p) => {
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

  const instansiList = [...new Set(dataFinal.map((p) => p.instansi))];

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
    const validNilai = list.map((item) => parseFloat(item.nilai)).filter((n) => !isNaN(n));
    if (validNilai.length === 0) return { nilai: "-", indeks: "-" };
    const total = validNilai.reduce((acc, cur) => acc + cur, 0);
    const rataNilai = (total / validNilai.length).toFixed(2);
    const rataIndeks = hitungIndeksHuruf(rataNilai);
    return { nilai: rataNilai, indeks: rataIndeks };
  };

  useEffect(() => {
    const initialState = {};
    Object.keys(pesertaPerInstansi).forEach((instansi) => {
      initialState[instansi] = true;
    });
    setOpenInstansi(initialState);
  }, [filterInstansi, dataFinal]);

  return (
    <div className="app-layout">
      <SidebarAdm />
      <div className="content-area">
        <NavbarAdm onSearch={setSearchTerm} />

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
                            <tr key={peserta.id_peserta_magang}>
                              <td>{idx + 1}</td>
                              <td className="nama-cell">
                                <img
                                  src={`http://localhost:3000/static/images/${peserta.foto_diri}`}
                                  alt="Foto Profil"
                                />
                                <span>{highlightText(peserta.nama, searchTerm)}</span>
                              </td>
                              <td>{highlightText(peserta.instansi, searchTerm)}</td>
                              <td>
                                {dayjs(peserta.tanggal_mulai_magang).format("DD MMMM YYYY")}
                              </td>
                              <td>
                                {dayjs(peserta.tanggal_selesai_magang).format("DD MMMM YYYY")}
                              </td>
                              <td>{peserta.kategori}</td>
                              <td>
                                <span className="status-label selesai">
                                  {peserta.status_penerimaan}
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

                <div className="profile-pic">
                  <img
                    src={`http://localhost:3000/static/images/${selectedPeserta.foto_diri}`}
                    alt="Profil"
                    style={{ width: "90px", height: "90px", borderRadius: "10px" }}
                  />
                </div>

                <div className="detail-item"><b>Nama:</b><p>{selectedPeserta.nama}</p></div>
                <div className="detail-item"><b>NIM/NIP:</b><p>{selectedPeserta.nomor_identitas}</p></div>
                <div className="detail-item"><b>Instansi:</b><p>{selectedPeserta.instansi}</p></div>
                <div className="detail-item">
                  <b>Tanggal Mulai - Tanggal Selesai:</b>
                  <p>
                    {dayjs(selectedPeserta.tanggal_mulai_magang).format("DD MMMM YYYY")} hingga{" "}
                    {dayjs(selectedPeserta.tanggal_selesai_magang).format("DD MMMM YYYY")}
                  </p>
                </div>
                <div className="detail-item"><b>Kategori:</b><p>{selectedPeserta.kategori}</p></div>
                <div className="detail-item"><b>Email:</b><p>{selectedPeserta.email}</p></div>
                <div className="detail-item">
                  <b>Status:</b>
                  <p><span className="status-label selesai">{selectedPeserta.status_penerimaan}</span></p>
                </div>

                {/* Dokumen */}
                    <div className="detail-item">
                    <b>Dokumen :</b>
                    <div className="dokumen-list">
                        {selectedPeserta.dokumen_pendukung && JSON.parse(selectedPeserta.dokumen_pendukung).length > 0 ? (
                        JSON.parse(selectedPeserta.dokumen_pendukung).map((doc, index) => (
                            <div className="dokumen-item" key={index}>
                            <span>{doc}</span>
                            <div className="dokumen-actions">
                              <button className="btn-download" onClick={()=>{
                                  window.open(`http://localhost:3000/static/document/${doc}`,"_blank", "noopener,noreferrer")
                              }}>Download</button>
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
                        {selectedPeserta.surat_balasan ? (
                        <div className="dokumen-item">
                          <span>{selectedPeserta.surat_balasan}</span>
                          <div className="dokumen-actions">
                            <button className="btn-download"
                              onClick={()=>{
                                  window.open(`http://localhost:3000/public/document-admin/diterima/${selectedPeserta.surat_balasan}`,"_blank", "noopener,noreferrer")
                              }}
                            >
                              Download
                            </button>
                          </div>
                        </div>
                        ) : (
                        <p>Tidak ada surat</p>
                        )}
                    </div>
                    </div>

                    {/* Sertifikat */}
                    <div className="detail-item">
                    <b>Sertifikat :</b>
                    <div className="dokumen-list">
                        {selectedPeserta.sertifikat ? (
                        <div className="dokumen-item">
                          <span>{selectedPeserta.sertifikat}</span>
                          <div className="dokumen-actions">
                            <button
                                onClick={()=>{
                                  window.open(`http://localhost:3000/static/document-sertif/${selectedPeserta.sertifikat}`,"_blank", "noopener,noreferrer")
                              }}
                              className="btn-download"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                        ) : (
                        <p>Tidak ada sertifikat</p>
                        )}
                    </div>
                </div>
                <div className="nilai-modal-body">
                  <span>Nilai Per Departemen:</span>
                  {Object.entries(selectedPeserta.groupedByBidang || {}).map(([bidang, dataBidang], i) => {
                    const rataTeknis = getRataRata(dataBidang.teknis);
                    const rataNonTeknis = getRataRata(dataBidang.nonTeknis);
                    return (
                      <div key={i} className="nilai-section-group">
                    <div className="nilai-subjudul">
                        <h4 style={{fontWeight: "600"}}>Departemen: {bidang}</h4>
                        <h4>
                          ({dayjs(dataBidang.tanggal_mulai).format("DD MMMM YYYY")} hingga{" "}
                          {dayjs(dataBidang.tanggal_selesai).format("DD MMMM YYYY")})
                        </h4>
                    </div>

                        <div className="nilai-section">
                          <h4>Aspek Teknis</h4>
                          <table className="nilai-table">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Aspek Yang Dinilai</th>
                                <th>Nilai Angka</th>
                                <th>Indeks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dataBidang.teknis.length ? (
                                <>
                                  {dataBidang.teknis.map((item, j) => (
                                    <tr key={`teknis-${i}-${j}`}>
                                      <td>{j + 1}</td>
                                      <td>{item.aspek}</td>
                                      <td>{item.nilai || "-"}</td>
                                      <td>{hitungIndeksHuruf(item.nilai)}</td>
                                    </tr>
                                  ))}
                                  <tr>
                                    <td colSpan="2" style={{ fontWeight: 600 }}>Rata-rata</td>
                                    <td className="p-2">{rataTeknis.nilai}</td>
                                    <td className="p-2">{rataTeknis.indeks}</td>
                                  </tr>
                                </>
                              ) : (
                                <tr>
                                  <td colSpan="3" style={{ textAlign: "center" }}>Tidak ada data</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="nilai-section">
                          <h4>Aspek Non Teknis</h4>
                          <table className="nilai-table">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Aspek Yang Dinilai</th>
                                <th>Nilai Angka</th>
                                <th>Indeks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dataBidang.nonTeknis.length ? (
                                <>
                                  {dataBidang.nonTeknis.map((item, j) => (
                                    <tr key={`nonteknis-${i}-${j}`}>
                                      <td>{j + 1}</td>
                                      <td>{item.aspek}</td>
                                      <td>{item.nilai || "-"}</td>
                                      <td>{hitungIndeksHuruf(item.nilai)}</td>
                                    </tr>
                                  ))}
                                  <tr>
                                    <td colSpan="2" style={{ fontWeight: 600 }}>Rata-rata</td>
                                    <td className="p-2">{rataNonTeknis.nilai}</td>
                                    <td className="p-2">{rataNonTeknis.indeks}</td>
                                  </tr>
                                </>
                              ) : (
                                <tr>
                                  <td colSpan="3" style={{ textAlign: "center" }}>Tidak ada data</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
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
