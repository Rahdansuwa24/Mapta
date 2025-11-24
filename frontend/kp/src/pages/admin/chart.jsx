import React, { useEffect, useState } from 'react';
import SidebarAdmTm from "../../components/sidebar-adm";
import NavbarAdmTm from "../../components/navbar-adm";
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
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";

// generate warna unlimited
const generateColor = (index) => {
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 65%, 55%)`;
};

export default function AdminChartsMapta() {
    useEffect(() => {
        document.title = "Admin MAPTA";
    }, []);

    const [yearlyData, setYearlyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const yd = [
            { year: 2021, count: 42 },
            { year: 2022, count: 78 },
            { year: 2023, count: 105 },
            { year: 2024, count: 149 },
            { year: 2025, count: 96 },
        ];

        const mdTemplate = () => [
            { month: 'Jan', count: Math.floor(Math.random() * 30) },
            { month: 'Feb', count: Math.floor(Math.random() * 30) },
            { month: 'Mar', count: Math.floor(Math.random() * 30) },
            { month: 'Apr', count: Math.floor(Math.random() * 30) },
            { month: 'May', count: Math.floor(Math.random() * 30) },
            { month: 'Jun', count: Math.floor(Math.random() * 30) },
            { month: 'Jul', count: Math.floor(Math.random() * 30) },
            { month: 'Aug', count: Math.floor(Math.random() * 30) },
            { month: 'Sep', count: Math.floor(Math.random() * 30) },
            { month: 'Oct', count: Math.floor(Math.random() * 30) },
            { month: 'Nov', count: Math.floor(Math.random() * 30) },
            { month: 'Dec', count: Math.floor(Math.random() * 30) },
        ];

        const cd = [
            { name: 'ITS', value: 91 },
            { name: 'PNJ', value: 77 },
            { name: 'PENS', value: 63 },
            { name: 'UNESA', value: 44 },
            { name: 'UPN Veteran Jatim', value: 38 },
            { name: 'POLINEMA', value: 33 },
            { name: 'Universitas Airlangga', value: 29 },
            { name: 'Universitas Brawijaya', value: 26 },
            { name: 'UMM', value: 22 },
            { name: 'Politeknik Negeri Jember', value: 16 },
            { name: 'Universitas Trunojoyo', value: 11 },
        ];

        setYearlyData(yd);
        setMonthlyData(mdTemplate(selectedYear));
        setCategoryData(cd);
    }, [selectedYear]);

    const handleDownloadChartsPDF = async () => {
        const element = document.getElementById('charts-wrapper');
        if (!element) return;

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;

        pdf.setFontSize(16);
        pdf.text("Statistik Pendaftaran Peserta Magang", 10, 10);
        pdf.addImage(imgData, "PNG", 10, 18, imgWidth, imgHeight);

        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            pdf.addPage();
            const position = heightLeft - imgHeight + 18;
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // BAGIAN TABEL DATA
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.text("Detail Data Statistik", 10, 15);

        // 1️⃣ Tabel Pendaftar per Tahun
        pdf.text("Pendaftar per Tahun", 10, 25);
        pdf.autoTable({
            startY: 30,
            head: [['Tahun', 'Jumlah']],
            body: yearlyData.map((row) => [row.year, row.count]),
            theme: 'striped',
            headStyles: { fillColor: [45, 90, 156], textColor: 255 },
        });

        // 2️⃣ Tabel Pendaftar per Bulan
        let finalY = pdf.lastAutoTable.finalY + 10;
        pdf.text(`Pendaftar per Bulan (${selectedYear})`, 10, finalY);
        pdf.autoTable({
            startY: finalY + 5,
            head: [['Bulan', 'Jumlah']],
            body: monthlyData.map((row) => [row.month, row.count]),
            theme: 'striped',
            headStyles: { fillColor: [45, 90, 156], textColor: 255 },
        });

        // 3️⃣ Tabel Distribusi per Instansi
        finalY = pdf.lastAutoTable.finalY + 10;
        pdf.text("Distribusi Peserta per Instansi / Universitas", 10, finalY);
        pdf.autoTable({
            startY: finalY + 5,
            head: [['Instansi / Universitas', 'Jumlah']],
            body: categoryData.map((row) => [row.name, row.value]),
            theme: 'striped',
            headStyles: { fillColor: [45, 90, 156], textColor: 255 },
        });

        pdf.save(`data-statistik-peserta-magang.pdf`);
    };

    return (
        <div className="app-layout">
            <SidebarAdmTm />
            <div className="content-area">
                <NavbarAdmTm />
                <section className="main">
                    <div className="max-w-7xl mx-auto">

                        <div className="download-wrapper mb-3 flex justify-between items-center">
                            <p className="judul-chart-daftar">Statistik Pendaftaran Peserta Magang</p>
                            <button onClick={handleDownloadChartsPDF} className="bg-green-600">
                                <span className="icon">Download Data</span>
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
                                            <YAxis />
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
                                        className="border rounded-md px-2 py-1 text-sm bg-gray-50"
                                    >
                                        {yearlyData.map((y) => (
                                            <option key={y.year} value={y.year}>
                                                {y.year}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ width: '100%', height: 220 }}>
                                    <ResponsiveContainer>
                                        <LineChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#D3DAE6" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
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
                                </div>
                            </div>

                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
}
