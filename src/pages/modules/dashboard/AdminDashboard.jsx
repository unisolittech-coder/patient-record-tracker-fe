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
import { Bar } from 'react-chartjs-2';
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
    const [ageGroupChartData, setAgeGroupChartData] = useState(null);

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

    useEffect(() => {
        fetchDashboardStats();
        fetchGenderDistributionData();
    }, []);

    useEffect(() => {
        fetchRegistrationChartData(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    // Patient registration chart
    useEffect(() => {
        if (registrationChartData && registrationChartData.length > 0) {
            const labels = registrationChartData.map(item => {
                const date = new Date(item.date);
                return date.getDate().toString();
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

    // Age Group Bar Chart
    useEffect(() => {
        if (genderDistributionData && typeof genderDistributionData === 'object') {
            const ageLabels = ['0-18', '19-35', '36-50', '51-65', '65+'];

            setAgeGroupChartData({
                labels: ageLabels,
                datasets: [
                    {
                        label: 'Male',
                        data: ageLabels.map(label => genderDistributionData?.Male?.ageGroups?.[label] || 0),
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderRadius: 6,
                    },
                    {
                        label: 'Female',
                        data: ageLabels.map(label => genderDistributionData?.Female?.ageGroups?.[label] || 0),
                        backgroundColor: 'rgba(236, 72, 153, 0.8)',
                        borderRadius: 6,
                    },
                    {
                        label: 'Other',
                        data: ageLabels.map(label => genderDistributionData?.Other?.ageGroups?.[label] || 0),
                        backgroundColor: 'rgba(156, 163, 175, 0.8)',
                        borderRadius: 6,
                    }
                ]
            });
        } else {
            setAgeGroupChartData(null);
        }
    }, [genderDistributionData]);

    const dashboardData = [
        {
            title: 'Total Patients',
            value: dashboardStatsData?.totalPatients || '0',
            icon: 'pi pi-users',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: "Today's Registrations",
            value: dashboardStatsData?.todaysRegistration || '0',
            icon: 'pi pi-user-plus',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            title: 'Total Reports Uploaded',
            value: dashboardStatsData?.totalReportsUploaded || '0',
            icon: 'pi pi-file-pdf',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            title: "Today's Reports Uploaded",
            value: dashboardStatsData?.todaysReportsUploaded || '0',
            icon: 'pi pi-cloud-upload',
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
                },
                grid: {
                    color: 'rgba(229, 231, 235, 0.6)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    const ageGroupBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                },
                grid: {
                    color: 'rgba(229, 231, 235, 0.6)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
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

            {/* Top Summary Cards */}
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

            {/* Registration Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
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

                <div className="h-[340px]">
                    {chartData ? (
                        <Bar data={chartData} options={barChartOptions} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400">No registration data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Age Group Distribution */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Age Group Distribution</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Gender-wise patient count across age groups
                    </p>
                </div>

                <div className="h-[340px]">
                    {ageGroupChartData ? (
                        <Bar data={ageGroupChartData} options={ageGroupBarOptions} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400">No age group data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}