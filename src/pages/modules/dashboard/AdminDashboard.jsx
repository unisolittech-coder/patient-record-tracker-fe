import React from 'react';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';

export default function AdminDashboard() {
    const breadcrumbPaths = [
        { label: 'Dashboard Overview', url: '/dashboard' }
    ];

    const dashboardData = [
        {
            title: 'Total Patients',
            value: '12,345',
            trend: '+12%',
            trendLabel: 'from last month',
            icon: 'pi pi-users',
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: "Today's Registrations",
            value: '142',
            trend: '+5%',
            trendLabel: 'from yesterday',
            icon: 'pi pi-user-plus',
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Total Reports Uploaded',
            value: '45,678',
            trend: '+8%',
            trendLabel: 'from last month',
            icon: 'pi pi-file-pdf',
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: "Today's Reports Uploaded",
            value: '356',
            trend: '-2%',
            trendLabel: 'from yesterday',
            icon: 'pi pi-cloud-upload',
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <BreadCrumb paths={breadcrumbPaths} />
            <PagePath title="Dashboard Overview" />

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardData.map((data, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{data.title}</p>
                                <h3 className="text-3xl font-bold text-gray-800">{data.value}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${data.bgColor}`}>
                                <i className={`${data.icon} text-2xl ${data.textColor}`}></i>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-auto">
                            <span className={`text-sm font-medium ${data.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                {data.trend}
                            </span>
                            <span className="text-sm text-gray-400">{data.trendLabel}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for future charts or tables */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px] flex items-center justify-center">
                    <p className="text-gray-400 font-medium">Activity Chart Placeholder</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px] flex items-center justify-center">
                    <p className="text-gray-400 font-medium">Recent Activity Placeholder</p>
                </div>
            </div>
        </div>
    );
}
