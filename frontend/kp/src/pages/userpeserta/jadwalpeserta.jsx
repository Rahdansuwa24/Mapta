import { motion } from "framer-motion";

// PAGE JADWAL PESERTA
import React, { useEffect } from "react";
import SidebarUsr from "../../components/sidebar-user";
import NavbarUsr from "../../components/navbar-user";
import { BiSolidCalendar } from "react-icons/bi";
import { FaCircleCheck } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";

import "../../styles/user.css";

function JadwalPeserta() {
    useEffect(() => {
        document.title = "Jadwal Peserta";
    }, []);

    // Contoh data jadwal (dummy)
    const jadwalDummy = {
        periode: [
            "10 Juli 2025 s.d. 15 Agustus 2025",
            "10 Juli 2025 s.d. 15 Agustus 2025",
            "10 Juli 2025 s.d. 15 Agustus 2025",
            "10 Juli 2025 s.d. 15 Agustus 2025",
            "10 Juli 2025 s.d. 15 Agustus 2025",
        ],
        departemen: [
            { nama: "Pelayanan", jadwal: ["Budi Santoso", "-", "-", "-", "-"] },
            { nama: "Kearsipan", jadwal: ["-", "-", "Budi Santoso", "-", "-"] },
            { nama: "Penyelamatan Arsip", jadwal: ["-", "Budi Santoso", "-", "-", "-"] },
            { nama: "Deposit Buku", jadwal: ["-", "-", "-", "Budi Santoso", "-"] },
            { nama: "Kesekretariatan", jadwal: ["-", "-", "-", "-", "Budi Santoso"] },
        ],
    };

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
                                    {jadwalDummy.periode.map((p, idx) => (
                                        <th key={idx}>{p}</th>
                                    ))}
                                </tr>
                            </thead>
                            <motion.tbody variants={containerVariants}>
                                {jadwalDummy.departemen.map((d, i) => (
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
