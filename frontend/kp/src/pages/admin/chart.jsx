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

    const PIE_COLORS = [
    '#2D5A9C', 
    '#F0A500',
    '#E4572E', 
    '#4CAF50', 
    '#8D33FF', 
    ];

    export default function AdminChartsMapta() {
    const handleDownloadCharts = async () => {
        const element = document.getElementById('charts-wrapper');
        if (!element) return;
        const canvas = await window.html2canvas(element);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `statistik-peserta-magang.png`;
        link.href = dataUrl;
        link.click();
    };
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

        const mdTemplate = (year) => [
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
        { name: 'Teknik Komputer', value: 120 },
        { name: 'Manajemen', value: 80 },
        { name: 'Desain', value: 45 },
        { name: 'Multimedia', value: 60 },
        { name: 'Lainnya', value: 30 },
        ];

        setYearlyData(yd);
        setMonthlyData(mdTemplate(selectedYear));
        setCategoryData(cd);
    }, [selectedYear]);

    return (
        <div className="app-layout">
        <SidebarAdmTm />
        <div className="content-area">
            <NavbarAdmTm />
            <section className="main">
        <div className="max-w-7xl mx-auto">

            <div className="download-wrapper mb-3">
            <p className="judul-chart-daftar">Statistik Pendaftaran Peserta Magang</p>
            <button onClick={handleDownloadCharts} className="bg-green-600">
                <span className="icon">Download Chart</span> 
            </button>
            </div>

            <div id="charts-wrapper" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Bar Chart */}
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-md font-semibold text-gray-700">Pendaftar per Tahun</h2>
                <div className="text-sm text-gray-400">Total tahun: {yearlyData.length}</div>
                </div>

                <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                    <BarChart data={yearlyData}>
                    <defs>
                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2D5A9C" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#2D5A9C" stopOpacity={0.15}/>
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#D3DAE6"/>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Jumlah" radius={[8, 8, 0, 0]} fill="url(#colorBar)" />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-md font-semibold text-gray-700">Pendaftar per Bulan</h2>
                <div className="flex items-center gap-3">
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
                    <div className="text-sm text-gray-400">Tahun terpilih</div>
                </div>
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
                        strokeWidth={3.3}
                        dot={{ r: 6, strokeWidth: 2, fill: '#fff', stroke: '#2D5A9C' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-md font-semibold text-gray-700">Distribusi Peserta (per Program)</h2>
                <div className="text-sm text-gray-400">Snapshot saat ini</div>
                </div>

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
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
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
