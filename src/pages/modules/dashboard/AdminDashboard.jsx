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
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import BreadCrumb from '../../../components/common/BreadCrumb';
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

    const breadcrumbPaths = [
        { label: 'Dashboard Overview', url: '/dashboard' }
    ];

    useEffect(() => {
        fetchDashboardStats();
        fetchRegistrationChartData();
        fetchGenderDistributionData();
    }, []);

    useEffect(() => {
        // Process Registration Chart Data
        if (registrationChartData && registrationChartData.length > 0) {
            const labels = registrationChartData.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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
        }

        // Process Gender Distribution Data
        if (genderDistributionData) {
            const { Male, Female, Other, total } = genderDistributionData;

            setGenderChartData({
                labels: ['Male', 'Female', 'Other'],
                datasets: [
                    {
                        data: [Male?.count || 0, Female?.count || 0, Other?.count || 0],
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
        }
    }, [registrationChartData, genderDistributionData]);

    const dashboardData = [
        {
            title: 'Total Patients',
            value: dashboardStatsData?.totalPatients || '0',
            icon: 'pi pi-users',
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            trend: dashboardStatsData?.totalPatientsGrowth || '+0%',
            trendLabel: 'vs last month'
        },
        {
            title: "Today's Registrations",
            value: dashboardStatsData?.todaysRegistration || '0',
            icon: 'pi pi-user-plus',
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            trend: dashboardStatsData?.todaysRegistrationGrowth || '+0%',
            trendLabel: 'vs yesterday'
        },
        {
            title: 'Total Reports Uploaded',
            value: dashboardStatsData?.totalReportsUploaded || '0',
            icon: 'pi pi-file-pdf',
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            trend: dashboardStatsData?.totalReportsGrowth || '+0%',
            trendLabel: 'vs last month'
        },
        {
            title: "Today's Reports Uploaded",
            value: dashboardStatsData?.todaysReportsUploaded || '0',
            icon: 'pi pi-cloud-upload',
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
            trend: dashboardStatsData?.todaysReportsGrowth || '+0%',
            trendLabel: 'vs yesterday'
        }
    ];

    // Chart options
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
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        let value = context.parsed.y || 0;
                        return label + ': ' + value + ' patients';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 11
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 13,
                        weight: 'bold'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        let value = context.parsed || 0;
                        let total = context.dataset.data.reduce((a, b) => a + b, 0);
                        let percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return label + ': ' + value + ' (' + percentage + '%)';
                    }
                }
            }
        },
        animation: {
            animateRotate: true,
            duration: 1500
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

            {/* Stats Cards */}
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
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
                            <span className={`text-xs font-medium ${data.trend?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {data.trend}
                            </span>
                            <span className="text-xs text-gray-400">{data.trendLabel}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Registration Chart - Takes 2/3 of the space */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Patient Registrations</h3>
                            <p className="text-sm text-gray-500 mt-1">Last 7 days registration trend</p>
                        </div>
                        <div className="flex items-center gap-2">
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
                                <p className="text-gray-400">No data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Gender Distribution - Takes 1/3 of the space */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Gender Distribution</h3>
                            <p className="text-sm text-gray-500 mt-1">Patient demographics</p>
                        </div>
                    </div>
                    <div className="h-[300px] flex items-center justify-center">
                        {genderChartData && genderDistributionData?.total > 0 ? (
                            <div className="relative w-full h-full">
                                <Doughnut data={genderChartData} options={pieChartOptions} />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-800">{genderDistributionData?.total || 0}</p>
                                        <p className="text-xs text-gray-500">Total</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-400">No data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}