// PAGE SERTIFIKAT PESERTA

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SidebarUsr from "../../components/sidebar-user";
import NavbarUsr from "../../components/navbar-user";
import { BiSolidCalendar } from "react-icons/bi";
import { FaCircleCheck } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import axios from "axios";

import "../../styles/user.css";

function SertifikatPeserta() {
    const [fileUrl, setFileUrl] = useState(null);
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        document.title = "Sertifikat Peserta";
        fetchSertifikat()
        // contoh dummy file (bisa di-fetch dari backend)
        // setFileUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
        // null artinya sertifikat belum tersedia
    }, []);

    const fetchSertifikat = async()=>{
        const token = localStorage.getItem("token")
        try{
            const res  = await axios.get("http://localhost:3000/peserta/sertifikat", {
                headers: { Authorization: `Bearer ${token}` },
            })
            const sertifikat = res.data.sertifikat
            console.log(sertifikat)
            if(sertifikat){
                setFileUrl(`http://localhost:3000/static/document-sertif/${sertifikat}`);
                setFileName(sertifikat);
            }else{
                setFileUrl(null);
            }
        }catch(error){
            console.error(error)
            alert("gagal mendapat sertif")
        }
    }

    const handleDownload = (e) => {
        e.preventDefault();

        if (!fileUrl) return;

        const link = document.createElement("a");
        link.href = `http://localhost:3000/peserta/sertifikat/download/${fileName}`;
        link.setAttribute("download", fileName); // paksa browser download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderPreview = () => {
        if (!fileUrl) {
            return (
                <motion.div 
                    className="jp-preview-placeholder"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p>Sertifikat Belum Tersedia</p>
                </motion.div>
            );
        }

        const ext = fileUrl.split(".").pop().toLowerCase();

        if (ext === "pdf") {
            return (
                <motion.iframe
                    key="pdf-preview"
                    src={fileUrl}
                    width="100%"
                    height="600px"
                    style={{ border: "none", borderRadius: "8px" }}
                    title="Preview PDF"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                />
            );
        } else if (["doc", "docx", "ppt", "pptx"].includes(ext)) {
            return (
                <motion.iframe
                    key="office-preview"
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${window.location.origin}${fileUrl}`}
                    width="100%"
                    height="600px"
                    style={{ border: "none", borderRadius: "8px" }}
                    title="Preview Office"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                />
            );
        } else {
            return (
                <motion.div 
                    className="jp-preview-placeholder"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p>Format file tidak didukung untuk preview.</p>
                </motion.div>
            );
        }
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
                            Sertifikat Peserta Magang
                        </motion.p>

                        <motion.a
                            href={fileUrl || "#"}
                            className={`jp-tmbl-download ${!fileUrl ? "disabled" : ""}`}
                            onClick={handleDownload}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <FaDownload style={{ marginRight: "6px" }} />
                            Download
                        </motion.a>
                    </div>

                    <motion.div 
                        className="jp-container-instansi"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {renderPreview()}
                    </motion.div>
                </motion.section>
            </div>
        </div>
    );
}

export default SertifikatPeserta;
