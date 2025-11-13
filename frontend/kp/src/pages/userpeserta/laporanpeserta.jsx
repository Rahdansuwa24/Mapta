// PAGE UPLOAD LAPORAN AKHIR

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SidebarUsr from "../../components/sidebar-user";
import NavbarUsr from "../../components/navbar-user";
import { BiSolidCalendar } from "react-icons/bi";
import { FaCircleCheck } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { FaFileInvoice } from "react-icons/fa6";
import { FaFileDownload, FaFileUpload } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

import "../../styles/user.css";

function UploadLaporanAkhir() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        document.title = "Upload Laporan Akhir";
        fetchUploadedLaporan();
    }, []);

    const fetchUploadedLaporan = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("http://localhost:3000/peserta/laporan-akhir", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const laporan = res.data.laporan;
            if (laporan) {
                setUploadedFileUrl(`http://localhost:3000/static/laporan-akhir/${laporan}`);
                setFileName(laporan);
            } else {
                setUploadedFileUrl(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengambil data laporan akhir");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            toast.warning("Hanya file PDF yang diperbolehkan.");
            e.target.value = null;
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.warning("Pilih file PDF terlebih dahulu.");
            return;
        }

        const formData = new FormData();
        formData.append("laporan", selectedFile);

        const token = localStorage.getItem("token");

        try {
            await axios.post("http://localhost:3000/peserta/laporan-akhir/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Laporan akhir berhasil diunggah!");
            setSelectedFile(null);
            fetchUploadedLaporan();
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengunggah laporan akhir.");
        }
    };

    const renderPreview = () => {
        if (!uploadedFileUrl) {
            return (
                <motion.div
                    className="jp-preview-placeholder"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p>Belum ada laporan akhir yang diunggah.</p>
                </motion.div>
            );
        }

        return (
            <motion.iframe
                key="pdf-preview"
                src={uploadedFileUrl}
                width="100%"
                height="600px"
                style={{ border: "none", borderRadius: "8px" }}
                title="Preview Laporan Akhir"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            />
        );
    };

    return (
        <div className="jp-app-layout">
            <SidebarUsr
                menuItems={[
                    { path: "/peserta-jadwal", label: "Jadwal", icon: <BiSolidCalendar /> },
                    { path: "/peserta-nilai", label: "Nilai", icon: <FaCircleCheck /> },
                    { path: "/peserta-laporan", label: "Laporan Akhir", icon: <FaFileInvoice /> },
                    { path: "/peserta-sertifikat", label: "Sertifikat", icon: <IoDocumentText /> },
                    { path: "/files/buku-panduan-peserta.pdf", label: "Buku Panduan", icon: <FaFileDownload />, isDownload: true },
                ]}
            />

            <div className="jp-content-area">
                <NavbarUsr showSearch={false} />

                <motion.section
                    className="jp-main"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="jp-submain">
                        <motion.p
                            className="jp-judul-submain"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Upload Laporan Akhir Magang
                        </motion.p>
                    </div>

                    <motion.div
                        className="jp-container-instansi"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <form
                            onSubmit={handleUpload}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                                marginBottom: "24px",
                            }}
                        >
                            <label
                                htmlFor="file-upload"
                                style={{
                                    fontWeight: "500",
                                    color: "#333",
                                }}
                            >
                                Pilih File (PDF):
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    borderRadius: "8px",
                                }}
                            />

                            <motion.button
                                type="submit"
                                className="jp-tmbl-download"
                                style={{
                                    width: "fit-content",
                                    alignSelf: "center",
                                    backgroundColor: "#2F5D9F",
                                    border: "none",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    fontSize: "15px"
                                }}
                            >
                                <FaFileUpload style={{ marginRight: "8px" }} />
                                Unggah Laporan
                            </motion.button>
                        </form>

                        {renderPreview()}
                    </motion.div>
                </motion.section>
            </div>
        </div>
    );
}

export default UploadLaporanAkhir;
