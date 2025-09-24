import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsArrowUpCircle } from "react-icons/bs";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // ikon panah
import axios from 'axios'

import "../styles/pendaftaran.css";
import logoMapta from "../assets/images/logo_mapta.png";

export default function PendaftaranDinas() {
    useEffect(() => {
        document.title = "Registration Form MAPTA";
    }, []);

    const navigate = useNavigate();

    const [sections, setSections] = useState([0]);
    const [dokumenLabels, setDokumenLabels] = useState(["Dokumen:"]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [kategoriPertama, setKategoriPertama] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [formData, setFormData] = useState([
        {
            email: "",
            password: "",
            confirmPassword: "",
            nama: "",
            instansi: "",
            nomor_identitas: "",
            tanggal_mulai_magang: "",
            tanggal_selesai_magang: "",
            jenjang: "",
            kategori: "",
            foto: null,
            dokumen: [],
        }
    ])
    const [kuota, setKuota] = useState(0);

    useEffect(()=>{
        axios.get("http://localhost:3000/peserta/kuota")
        .then(res=> setKuota(res.data.sisaKuota))
        .catch(err=>console.error(err))
    }, [])
    // Scroll event untuk tombol scroll top
    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const addSection = () => {
        if(kategoriPertama === "kelompok" && sections.length < kuota){
            setSections((prev) => [...prev, prev.length]);
            setDokumenLabels((prev) => [...prev, "Dokumen:"]);
            setFormData((prev)=>[...prev, {
                email: "",
                password: "",
                confirmPassword: "",
                nama: "",
                instansi: prev[0].instansi,
                nomor_identitas: "",
                tanggal_mulai_magang: prev[0].tanggal_mulai_magang,
                tanggal_selesai_magang: prev[0].tanggal_selesai_magang,
                jenjang: "",
                kategori: "kelompok",
                foto: null,
                dokumen: [...prev[0].dokumen]
            }])
            setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
        }else{
            alert(`Kuota tersisa ${kuota - sections.length}. Tidak bisa menambah anggota lagi.`);
        }
    };

    const removeSection = (index) => {
        setSections((prev) => prev.filter((_, idx) => idx !== index));
        setDokumenLabels((prev) => prev.filter((_, idx) => idx !== index));
        setFormData((prev) => prev.filter((_, idx) => idx !== index));
    };

    const handleDokumenChange = (index, e) => {
        const files = Array.from(e.target.files);
        const allowedTypes = [
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const validFiles = files.filter(file => allowedTypes.includes(file.type));
        if (validFiles.length !== files.length) {
            alert("Hanya boleh upload file PDF dan Document!");
            e.target.value = ""; // reset input file agar bisa pilih ulang
            return;
        }
        setFormData((prev) => {
        const updatedData = [...prev];
        const existingFiles = updatedData[index].dokumen;
        const combinedFiles = [...existingFiles];
        validFiles.forEach(file => {
            if (!existingFiles.some(f => f.name === file.name && f.size === file.size)) {
                combinedFiles.push(file);
            }
        });
            updatedData[index].dokumen = combinedFiles;
            return updatedData;
        });

        e.target.value = "";
    };

    const handleRemoveFile = (sectionIndex, fileIndex) => {
    setFormData((prev) => {
        const updatedData = [...prev];
        updatedData[sectionIndex].dokumen = updatedData[sectionIndex].dokumen.filter(
            (_, idx) => idx !== fileIndex
        );
        return updatedData;
    });
    };

    const handleChange = (index, name, value) => {
        const updatedData = [...formData];
        updatedData[index][name] = value;
        setFormData(updatedData);
    }

    const handleFotoChange = (index, e) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            alert("Hanya boleh upload foto dengan format JPG atau PNG!");
            e.target.value = ""; 
            return;
        }
        const updatedData = [...formData];
        updatedData[index].foto = file;
        setFormData(updatedData);
        e.target.value = "";
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Submit terpanggil!");
        if (!kategoriPertama) {
            alert("Pilih kategori pendaftaran terlebih dahulu!");
            return;
        }

        if (kategoriPertama === "kelompok" && formData.length < 2) {
            alert("Kelompok harus memiliki minimal 2 anggota.");
            return;
        }
        if (kategoriPertama === "kelompok" && sections.length > kuota) {
            alert("Kuota sudah penuh, tidak bisa mendaftar.");
            return;
        }
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].password !== formData[i].confirmPassword) {
            alert(`Password dan konfirmasi password tidak sama untuk peserta ${i + 1}`);
            return;
            }
        }
        if(kategoriPertama === "kelompok"){
            for(let i=0; i<formData.length; i++){
                if(!formData[i].foto){
                    alert(`Foto untuk anggota ${i + 1} wajib diunggah`);
                    return;
                }
                if (!formData[i].dokumen || formData[i].dokumen.length === 0) {
                    alert(`Dokumen pendukung untuk anggota ${i + 1} wajib diunggah`);
                    return;
                }
            }
        }

        const formDataToSend = new FormData();
        formDataToSend.append("kategori", kategoriPertama);

        if (kategoriPertama === 'individu') {
            const user = { ...formData[0], kategori: "individu" };
            for (let key of ["email", "password", "nama", "instansi", "nomor_identitas", "tanggal_mulai_magang", "tanggal_selesai_magang", "jenjang"]) {
                formDataToSend.append(key, user[key]);
            }

            if (user.foto) formDataToSend.append('foto_diri', user.foto);
            if (user.dokumen.length > 0) {
                user.dokumen.forEach(file => formDataToSend.append('dokumen_pendukung', file));
            }
        } else { 
            formData.forEach((user, index) => {
                for (let key of ["email", "password", "nama", "instansi", "nomor_identitas", "tanggal_mulai_magang", "tanggal_selesai_magang", "jenjang"]) {
                    formDataToSend.append(`users[${index}][${key}]`, user[key]);
                }

                if (user.foto) formDataToSend.append(`foto_diri_${index}`, user.foto);
                if (user.dokumen) {
                    user.dokumen.forEach(file => formDataToSend.append(`dokumen_pendukung_${index}`, file));
                }
                 console.log("Isi dokumen untuk user", index, user.dokumen);
                 console.log("Isi foto untuk user", index, user.foto);
            });

        }
        
        for (let pair of formDataToSend.entries()) {
            console.log(pair[0], pair[1]);
        }
        try {
            const response = await axios.post("http://localhost:3000/peserta/register", formDataToSend) 
            console.log("Response:", response.data);
            alert(response.data.message);

            setFormData([{
                email: "",
                password: "",
                confirmPassword: "",
                nama: "",
                instansi: "",
                nomor_identitas: "",
                tanggal_mulai_magang: "",
                tanggal_selesai_magang: "",
                jenjang: "",
                kategori: "",
                foto: null,
                dokumen: [],
            }]);
            setSections([0]);
            setKategoriPertama("");

            document.querySelectorAll('input[type="file"]').forEach(input => {
                input.value = "";
            });
        } catch (error) {
            console.error(error);
            alert("Gagal mendaftar: " + (error.response?.data?.message || "Terjadi kesalahan"));
        }
    };
    const renderFormSection = (index, withTopInfo) => (
        <motion.div
            className={`form-box ${index === 0 ? "first" : ""}`}
            key={index}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
        >
            {withTopInfo && (
                <div className="top-info">
                    {/* <button
                        type="button"
                        onClick={addSection}
                        disabled={kategoriPertama !== "kelompok"}
                        style={{
                            opacity: kategoriPertama === "kelompok" ? 1 : 0.5,
                            cursor:
                                kategoriPertama === "kelompok" ? "pointer" : "not-allowed",
                        }}
                    >
                        Tambah
                    </button> */}
                    <b>Note:</b> Peserta Instansi/Dinas wajib mengunggah foto berseragam dinas, sedangkan dokumen bersifat opsional (dapat dikirim saat pendaftaran atau menyusul).
                </div>
            )}

            {index !== 0 && (
                <button
                    type="button"
                    onClick={() => removeSection(index)}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "#FF5C5C",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                    title="Hapus Form"
                >
                    X
                </button>
            )}

            <div className="form-section">
                {/* KOLOM KIRI */}
                <div className="kolom">
                    <div className="foto-jenjang">
                        <label className="upload-box">
                            {formData[index].foto ? (
                                <img 
                                    src={URL.createObjectURL(formData[index].foto)} 
                                    alt="Preview Foto" 
                                    style={{ width: "100%", height: "auto", borderRadius: "8px" }}/>
                            ):(<span>Upload Foto</span>)}
                            <input type="file" onChange={(e) => handleFotoChange(index, e)} />
                        </label>
                        <div className="samping-foto">
                            <select value={formData[index].jenjang} onChange={(e)=>handleChange(index, "jenjang", e.target.value)}>
                                <option value="">Pilih Jenjang</option>
                                <option value="siswa">Siswa</option>
                                <option value="dinas">Dinas</option>
                            </select>
                            <select
                                value={index === 0 ? kategoriPertama : "kelompok"}
                                disabled={index !== 0}
                                onChange={(e) => {
                                    if (index === 0) {
                                        const Selectvalue = e.target.value
                                        setKategoriPertama(e.target.value);
                                        
                                        setFormData((prev)=>{
                                            const updated = [...prev]
                                            updated[0].kategori = Selectvalue;

                                            if(Selectvalue === "individu"){
                                                return [updated[0]];
                                            }else{
                                                    return updated.map((u, idx) => ({
                                                    ...u,
                                                    kategori: idx === 0 ? Selectvalue : "kelompok"
                                                }));
                                            }
                                        })
                                        if (Selectvalue === "individu") {
                                            setSections([0]);
                                        }
                                    }
                                }}>
                                <option value="">Pilih Kategori</option>
                                <option value="individu">Individu</option>
                                <option value="kelompok">Kelompok</option>
                            </select>
                        </div>
                    </div>
                    <input type="email" placeholder="Email Aktif" value={formData[index].email} onChange={(e)=>handleChange(index, "email", e.target.value)} />
                    {/* password */}
                    <div className="password-input">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Buat Password"
                        value={formData[index].password}
                        onChange={(e) =>
                        handleChange(index, "password", e.target.value)
                        }
                    />
                    <span
                        className="toggle-eye"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <ImEyeBlocked /> : <ImEye />}
                    </span>
                    </div>

                    {/* konfirmasi password */}
                    <div className="password-input">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Ketik Ulang Password"
                        value={formData[index].confirmPassword}
                        onChange={(e) =>
                        handleChange(index, "confirmPassword", e.target.value)
                        }
                    />
                    <span
                        className="toggle-eye"
                        onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                        }
                    >
                        {showConfirmPassword ? <ImEyeBlocked /> : <ImEye />}
                    </span>
                    </div>

                </div>

                {/* KOLOM KANAN */}
                <div className="kolom">
                    <input type="text" placeholder="Nama Lengkap" value={formData[index].nama} onChange={(e)=>handleChange(index, "nama", e.target.value)} />
                    <input type="text" placeholder="Instansi" value={formData[index].instansi} onChange={(e)=>handleChange(index, "instansi", e.target.value)} />
                    <input type="text" placeholder="NIP/NIM" value={formData[index].nomor_identitas} onChange={(e)=>handleChange(index, "nomor_identitas", e.target.value)}/>

                    <div className="row-dua">
                        <input
                            type="text"
                            placeholder="Tanggal Mulai Magang"
                            value={formData[index].tanggal_mulai_magang}
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => {
                                if (!e.target.value) e.target.type = "text";
                            }}
                            onChange={(e)=>handleChange(index, "tanggal_mulai_magang", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Tanggal Selesai Magang"
                            value={formData[index].tanggal_selesai_magang}
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => {
                                if (!e.target.value) e.target.type = "text";
                            }}
                            onChange={(e)=>handleChange(index, "tanggal_selesai_magang", e.target.value)}
                        />
                    </div>
                    {/* Label dan Input */}
                    <label className="input-file-wrap">
                        <div className="placeholder-text">
                            Upload Dokumen Pendukung
                        </div>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => handleDokumenChange(index, e)}
                            className="custom-input-file"
                        />
                    </label>
                </div>

                    {/* Preview file */}
                    {formData[index].dokumen.length > 0 && (
                    <div className="custom-file-list">
                        {formData[index].dokumen.map((f, i) => (
                        <div key={i} className="custom-file-item">
                            <span className="custom-file-name">{f.name}</span>
                            <button
                            type="button"
                            onClick={() => handleRemoveFile(index, i)}
                            className="custom-remove-btn"
                            >
                            ×
                            </button>
                        </div>
                        ))}
                    </div>
                    )}

                {/* <p>

                </p> */}
            </div>
        </motion.div>
    );
    return (
        <section className="pendaftaran-page">
        <button
            onClick={() => navigate(-1)}
            className="back-button"
        >
            <FaArrowLeft size={18} />
        </button>
            <section className="hero">
                <div className="header">
                    <div className="logo-wrap">
                        <img src={logoMapta} alt="MAPTA Logo" />
                        <p>MAPTA</p>
                    </div>
                    <a href="#">
                        &#9432; Kuota magang tersisa {kuota}. Pendaftaran ditutup saat
                        kuota penuh
                    </a>
                </div>
                <div className="title">
                    <h1>Formulir Pendaftaran Magang Dinas</h1>
                    <hr />
                    <p>
                        Silakan lengkapi data diri dan dokumen yang diperlukan
                        secara lengkap dan benar.
                        <br />
                        Data ini akan digunakan sebagai dasar seleksi dan
                        proses administrasi magang di lingkungan Disperpusip.
                    </p>
                </div>
            </section>
            <form onSubmit={handleRegister}>
                <AnimatePresence>
                    {sections.map((_, idx) => renderFormSection(idx, idx === 0))}
                </AnimatePresence>
                
                <div className="submit-btn">
                    <button type="submit">Daftar</button>
                </div>
            </form>
            {showScrollTop && (
                <button
                    className="scroll-top-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    title="Scroll ke Atas">
                    <BsArrowUpCircle />
                </button>
            )}

        </section>
    );
}
