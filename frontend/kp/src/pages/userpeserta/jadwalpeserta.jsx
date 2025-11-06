import { motion } from "framer-motion";

// PAGE JADWAL PESERTA
import React, { useEffect, useState } from "react";
import SidebarUsr from "../../components/sidebar-user";
import NavbarUsr from "../../components/navbar-user";
import { BiSolidCalendar } from "react-icons/bi";
import { FaCircleCheck } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { FaFileDownload } from "react-icons/fa";
import axios from 'axios'
import { toast } from "react-toastify";
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

import "../../styles/user.css";

function JadwalPeserta() {
    useEffect(() => {
        document.title = "Jadwal Peserta";
        fetchDataJadwal()
    }, []);

    const fetchDataJadwal = async()=>{
        const token = localStorage.getItem("token")
        try{
            const res = await axios.get("http://localhost:3000/peserta/jadwal", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            const jadwalPeserta = res.data.data
            const periode = jadwalPeserta.map((item) =>
            `${dayjs(item.tanggal_mulai).format("DD MMMM YYYY")} s.d. ${dayjs(item.tanggal_selesai).format("DD MMMM YYYY")}`
            );
            const bidangMap = {}
            jadwalPeserta.forEach((item, idx) => {
            if (!bidangMap[item.bidang]) {
                bidangMap[item.bidang] = Array(jadwalPeserta.length).fill("-");
            }
                bidangMap[item.bidang][idx] = item.nama;
            });
            const bidang = Object.keys(bidangMap).map((key) => ({
                nama: key,
                jadwal: bidangMap[key],
            }));
            setJadwalPeserta({periode, bidang})
        }catch(error){
            console.error(error)
            toast.error("Gagal mengambil data peserta")
        }
    }

    const [jadwalPeserta, setJadwalPeserta] = useState([])
    // Variants untuk animasi
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, when: "beforeChildren", staggerChildren: 0.15 },
        },
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    if (!jadwalPeserta) return <p>Jadwal Belum Disediakan Oleh Admin</p>;
    return (
        <div className="jp-app-layout">
            <SidebarUsr 
                menuItems={[
                    { path: "/peserta-jadwal", label: "Jadwal", icon: <BiSolidCalendar /> },
                    { path: "/peserta-nilai", label: "Nilai", icon: <FaCircleCheck /> },
                    { path: "/peserta-sertifikat", label: "Sertifikat", icon: <IoDocumentText /> },
                    { path: "/files/buku-panduan-peserta.pdf", label: "Buku Panduan", icon: <FaFileDownload  />, isDownload: true },
                ]}
            />
            <div className="jp-content-area">
                <NavbarUsr showSearch={false} />

                <motion.section 
                    className="jp-main"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="jp-submain">
                        <div className="jp-submain-actions">
                            <motion.p 
                                className="jp-judul-submain"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                Jadwal Peserta Magang
                            </motion.p>
                        </div>
                    </div>

                    <div className="jp-container-instansi">
                        <table className="jp-table-jadwal">
                            <thead>
                                <tr>
                                    <th>Tempat Departemen</th>
                                    {jadwalPeserta.periode?.map((p, idx) => (
                                        <th key={idx}>{p}</th>
                                    ))}
                                </tr>
                            </thead>
                            <motion.tbody variants={containerVariants}>
                                {jadwalPeserta.bidang?.map((d, i) => (
                                    <motion.tr key={i} variants={rowVariants}>
                                        <td className="jp-departemen-cell">{d.nama}</td>
                                        {d.jadwal.map((j, k) => (
                                            <td key={k}>{j}</td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </motion.tbody>
                        </table>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}

export default JadwalPeserta;
