import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
   Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import PagePath from '../../../components/common/PagePath';
import useDashboard from '../../../hooks/dashboard/useDashboard';
import Loader from '../../../components/common/Loader';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export default function AdminDashboard() {
    const {
        loading,
        dashboardStatsData,
        fetchDashboardStats,
        registrationChartData,
        fetchRegistrationChartData,
        genderDistributionData,
        fetchGenderDistributionData
    } = useDashboard();

    const [chartData, setChartData] = useState(null);
    const [genderChartData, setGenderChartData] = useState(null);

    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    const monthOptions = [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 }
    ];

    const yearOptions = Array.from({ length: 6 }, (_, index) => currentDate.getFullYear() - index);

    // Initial dashboard data fetch
    useEffect(() => {
        fetchDashboardStats();
        fetchGenderDistributionData();
    }, []);

    // Monthly registration chart fetch
    useEffect(() => {
        fetchRegistrationChartData(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    // Registration chart formatting
    useEffect(() => {
        if (registrationChartData && registrationChartData.length > 0) {
            const labels = registrationChartData.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });
            });

            const counts = registrationChartData.map(item => item.count);

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Patient Registrations',
                        data: counts,
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        borderRadius: 8,
                        hoverBackgroundColor: 'rgba(59, 130, 246, 0.9)',
                    }
                ]
            });
        } else {
            setChartData(null);
        }
    }, [registrationChartData]);

    // Gender chart formatting
    useEffect(() => {
        if (genderDistributionData && typeof genderDistributionData === 'object') {
            const maleCount = genderDistributionData?.Male?.count || 0;
            const femaleCount = genderDistributionData?.Female?.count || 0;
            const otherCount = genderDistributionData?.Other?.count || 0;

            setGenderChartData({
                labels: ['Male', 'Female', 'Other'],
                datasets: [
                    {
                        label: 'Patients',
                        data: [maleCount, femaleCount, otherCount],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(236, 72, 153, 0.8)',
                            'rgba(156, 163, 175, 0.8)'
                        ],
                        borderColor: [
                            'rgba(59, 130, 246, 1)',
                            'rgba(236, 72, 153, 1)',
                            'rgba(156, 163, 175, 1)'
                        ],
                        borderWidth: 2,
                    }
                ]
            });
        } else {
            setGenderChartData(null);
        }
    }, [genderDistributionData]);

    const dashboardData = [
        {
            title: 'Total Patients',
            value: dashboardStatsData?.totalPatients || '0',
            icon: 'pi pi-users',
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: "Today's Registrations",
            value: dashboardStatsData?.todaysRegistration || '0',
            icon: 'pi pi-user-plus',
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            title: 'Total Reports Uploaded',
            value: dashboardStatsData?.totalReportsUploaded || '0',
            icon: 'pi pi-file-pdf',
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            title: "Today's Reports Uploaded",
            value: dashboardStatsData?.todaysReportsUploaded || '0',
            icon: 'pi pi-cloud-upload',
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
        }
    ];

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 12
                    }
                }
            }
        },
        cutout: '65%'
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto pb-12">
                <PagePath title="Dashboard Overview" />
                <div className="flex justify-center items-center h-96">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <PagePath title="Dashboard Overview" />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                {dashboardData.map((data, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    {data.title}
                                </p>
                                <h3 className="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {data.value}
                                </h3>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${data.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                <i className={`${data.icon} text-2xl ${data.textColor}`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Registration Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Patient Registrations</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Monthly registration trend
                            </p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                {monthOptions.map((month) => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                {yearOptions.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>

                            <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                                {registrationChartData?.reduce((sum, item) => sum + item.count, 0) || 0} Total
                            </span>
                        </div>
                    </div>

                    <div className="h-[300px]">
                        {chartData ? (
                            <Bar data={chartData} options={barChartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400">No registration data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Gender Distribution */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Gender Distribution</h3>
                        <p className="text-sm text-gray-500 mt-1">Patient demographics</p>
                    </div>

                    <div className="h-[300px] flex items-center justify-center">
                        {genderChartData && genderDistributionData?.total > 0 ? (
                            <div className="relative w-full h-full">
                                <Doughnut data={genderChartData} options={pieChartOptions} />

                                {/* Center total */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-800">
                                            {genderDistributionData?.total || 0}
                                        </p>
                                        <p className="text-xs text-gray-500">Total</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-400">No gender distribution data available</p>
                            </div>
                        )}
                    </div>

                    {/* Gender Summary */}
                    {genderDistributionData?.total > 0 && (
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    <span className="text-gray-700">Male</span>
                                </div>
                                <span className="font-medium text-gray-800">
                                    {genderDistributionData?.Male?.count || 0} ({genderDistributionData?.Male?.percentage || 0}%)
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                                    <span className="text-gray-700">Female</span>
                                </div>
                                <span className="font-medium text-gray-800">
                                    {genderDistributionData?.Female?.count || 0} ({genderDistributionData?.Female?.percentage || 0}%)
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                                    <span className="text-gray-700">Other</span>
                                </div>
                                <span className="font-medium text-gray-800">
                                    {genderDistributionData?.Other?.count || 0} ({genderDistributionData?.Other?.percentage || 0}%)
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}