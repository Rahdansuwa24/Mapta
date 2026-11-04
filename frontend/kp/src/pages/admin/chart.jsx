import React, { useEffect, useState } from 'react';
import SidebarAdmTm from "../../components/sidebar-adm";
import NavbarAdmTm from "../../components/navbar-adm";
import api from "../../config/api";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from 'recharts';

import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { autoTable } from "jspdf-autotable";

const generateColor = (index) => {
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 65%, 55%)`;
};

export default function AdminChartsMapta() {
    useEffect(() => {
        document.title = "Admin MAPTA - Statistik";
    }, []);

    const [yearlyData, setYearlyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.get('/admin/dasbor/statistik', {
                    params: { year: selectedYear },
                });
                if (res.data?.status && res.data?.data) {
                    const { yearly, monthly, instansi, availableYears: years } = res.data.data;
                    setYearlyData(yearly || []);
                    setMonthlyData(monthly || []);
                    setCategoryData(instansi || []);
                    if (years && years.length > 0) {
                        setAvailableYears(years);
                    }
                }
            } catch (err) {
                console.error("Gagal memuat statistik:", err);
                setError("Gagal memuat data statistik dari server.");
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [selectedYear]);

    const handleDownloadChartsPDF = async () => {
        const element = document.getElementById('charts-wrapper');
        if (!element) return;

        try {
            setIsExporting(true);

            // Render visual grafik ke canvas gambar
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF("p", "mm", "a4");

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // HALAMAN 1: KOP LAPORAN & GRAFIK VISUAL
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(15);
            pdf.setTextColor(45, 90, 156);
            pdf.text("LAPORAN STATISTIK PENDAFTARAN PESERTA MAGANG", margin, 15);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(110, 110, 110);
            const tanggalCetak = new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            pdf.text(`Waktu Cetak: ${tanggalCetak} WIB | Tahun Analisis: ${selectedYear}`, margin, 21);

            // Garis pembatas header
            pdf.setDrawColor(210, 220, 235);
            pdf.setLineWidth(0.4);
            pdf.line(margin, 24, pageWidth - margin, 24);

            // Tampilkan grafik secara proporsional di halaman 1
            const maxChartHeight = pageHeight - 32 - margin;
            if (imgHeight <= maxChartHeight) {
                pdf.addImage(imgData, "PNG", margin, 27, imgWidth, imgHeight);
            } else {
                const scaledHeight = maxChartHeight;
                const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
                const posX = margin + (imgWidth - scaledWidth) / 2;
                pdf.addImage(imgData, "PNG", posX, 27, scaledWidth, scaledHeight);
            }

            // HALAMAN 2: TABEL DETAIL DATA STATISTIK
            pdf.addPage();

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(13);
            pdf.setTextColor(45, 90, 156);
            pdf.text("DETAIL REKAPITULASI DATA STATISTIK", margin, 15);

            pdf.setDrawColor(210, 220, 235);
            pdf.setLineWidth(0.4);
            pdf.line(margin, 18, pageWidth - margin, 18);

            // Helper aman pemanggil autoTable
            const callAutoTable = (options) => {
                if (typeof autoTable === 'function') {
                    autoTable(pdf, options);
                } else if (typeof pdf.autoTable === 'function') {
                    pdf.autoTable(options);
                }
            };

            // 1. Tabel Pendaftar per Tahun
            pdf.setFontSize(10.5);
            pdf.setTextColor(30, 41, 59);
            pdf.text("1. Pendaftar per Tahun", margin, 26);
            callAutoTable({
                startY: 29,
                head: [['Tahun', 'Jumlah Pendaftar']],
                body: yearlyData.map((row) => [row.year, `${row.count} orang`]),
                theme: 'striped',
                headStyles: { fillColor: [45, 90, 156], textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 8.5, cellPadding: 2.5 },
                margin: { left: margin, right: margin }
            });

            // 2. Tabel Pendaftar per Bulan
            let currentY = (pdf.lastAutoTable ? pdf.lastAutoTable.finalY : 30) + 9;
            pdf.setFontSize(10.5);
            pdf.setTextColor(30, 41, 59);
            pdf.text(`2. Pendaftar per Bulan (Tahun ${selectedYear})`, margin, currentY);
            callAutoTable({
                startY: currentY + 3,
                head: [['Bulan', 'Jumlah Pendaftar']],
                body: monthlyData.map((row) => [row.month, `${row.count} orang`]),
                theme: 'striped',
                headStyles: { fillColor: [45, 90, 156], textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 8.5, cellPadding: 2.5 },
                margin: { left: margin, right: margin }
            });

            // 3. Tabel Distribusi per Instansi
            currentY = (pdf.lastAutoTable ? pdf.lastAutoTable.finalY : currentY) + 9;
            if (currentY > pageHeight - 45) {
                pdf.addPage();
                currentY = 18;
            }
            pdf.setFontSize(10.5);
            pdf.setTextColor(30, 41, 59);
            pdf.text("3. Distribusi Peserta per Instansi / Universitas", margin, currentY);
            callAutoTable({
                startY: currentY + 3,
                head: [['Instansi / Universitas', 'Jumlah Peserta']],
                body: categoryData.length > 0 
                    ? categoryData.map((row) => [row.name, `${row.value} orang`])
                    : [['Belum ada data instansi', '0 orang']],
                theme: 'striped',
                headStyles: { fillColor: [45, 90, 156], textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 8.5, cellPadding: 2.5 },
                margin: { left: margin, right: margin }
            });

            pdf.save(`laporan-statistik-magang-${selectedYear}.pdf`);
        } catch (err) {
            console.error("Gagal membuat PDF:", err);
            alert("Terjadi kendala saat membuat file PDF: " + err.message);
        } finally {
            setIsExporting(false);
        }
    };

    const yearOptions = availableYears.length > 0 
        ? availableYears 
        : yearlyData.map(y => y.year);

    return (
        <div className="app-layout">
            <SidebarAdmTm />
            <div className="content-area">
                <NavbarAdmTm />
                <section className="main">
                    <div className="max-w-7xl mx-auto">

                        <div className="download-wrapper mb-3 flex justify-between items-center">
                            <div>
                                <p className="judul-chart-daftar">Statistik Pendaftaran Peserta Magang</p>
                                {loading && (
                                    <span className="text-xs text-blue-600 font-medium">Memuat data terbaru...</span>
                                )}
                                {error && (
                                    <span className="text-xs text-red-500 font-medium">{error}</span>
                                )}
                            </div>
                            <button 
                                onClick={handleDownloadChartsPDF} 
                                disabled={isExporting}
                                style={{ opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'not-allowed' : 'pointer' }}
                            >
                                <span className="icon">
                                    {isExporting ? 'Menyiapkan PDF...' : 'Download Data'}
                                </span>
                            </button>
                        </div>

                        <div id="charts-wrapper" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* BAR — pendaftar per tahun */}
                            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                                <h2 className="text-md font-semibold text-gray-700 mb-3">Pendaftar per Tahun</h2>
                                <div style={{ width: '100%', height: 220 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={yearlyData}>
                                            <defs>
                                                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#2D5A9C" stopOpacity={0.9} />
                                                    <stop offset="100%" stopColor="#2D5A9C" stopOpacity={0.15} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#D3DAE6" />
                                            <XAxis dataKey="year" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="count" name="Jumlah" radius={[8, 8, 0, 0]} fill="url(#colorBar)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* LINE — pendaftar per bulan */}
                            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-md font-semibold text-gray-700">Pendaftar per Bulan</h2>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                        className="border rounded-md px-2 py-1 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        {yearOptions.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ width: '100%', height: 220 }}>
                                    <ResponsiveContainer>
                                        <LineChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#D3DAE6" />
                                            <XAxis dataKey="month" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                name="Jumlah"
                                                stroke="#2D5A9C"
                                                strokeWidth={3.2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* PIE — per INSTANSI*/}
                            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                                <h2 className="text-md font-semibold text-gray-700 mb-3">
                                    Distribusi Peserta per Instansi / Universitas
                                </h2>
                                <div style={{ width: '100%', height: 260 }}>
                                    {categoryData.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                            Belum ada data instansi
                                        </div>
                                    ) : (
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Tooltip />
                                                <Legend />
                                                <Pie
                                                    data={categoryData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label={(entry) => entry.name}
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={generateColor(index)}
                                                            stroke="#ffffff"
                                                            strokeWidth={2}
                                                        />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
}
