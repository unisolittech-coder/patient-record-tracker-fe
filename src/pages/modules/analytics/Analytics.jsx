import React, { useEffect, useState } from 'react';
import PagePath from '../../../components/common/PagePath';
import useAnalytics from '../../../hooks/analytics/useAnalytics';
import Loader from '../../../components/common/Loader';
import Button from '../../../components/common/Button';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';

export default function Analytics() {
    const { 
        loading, 
        fetchLogs, 
        analyticsLogs, 
        analyticsReportUpload, 
        fetchReportUpload,
        fetchReportDownload, 
        analyticsReportDownload 
    } = useAnalytics();
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [activeTab, setActiveTab] = useState('logs');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [actionFilter, setActionFilter] = useState('');

    // Fetch data when page, limit, or filters change based on active tab
    useEffect(() => {
        fetchDataByTab();
    }, [page, limit, startDate, endDate, actionFilter, activeTab]);

    const fetchDataByTab = () => {
        switch(activeTab) {
            case 'logs':
                fetchLogs(page, limit, startDate, endDate, actionFilter);
                break;
            case 'uploads':
                fetchReportUpload(page, limit, startDate, endDate);
                break;
            case 'downloads':
                fetchReportDownload(page, limit, startDate, endDate);
                break;
            default:
                break;
        }
    };

    // Fetch all data when component mounts
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = () => {
        fetchLogs(page, limit, startDate, endDate, actionFilter);
        fetchReportUpload(page, limit, startDate, endDate);
        fetchReportDownload(page, limit, startDate, endDate);
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setPage(1);
        // fetchDataByTab will be called automatically due to useEffect
    };

    // Handle filter changes - automatically triggers data fetch
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setPage(1);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setPage(1);
    };

    const handleActionFilterChange = (e) => {
        setActionFilter(e.target.value);
        setPage(1);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const getActionBadge = (action) => {
        const styles = {
            'login': 'bg-green-100 text-green-800',
            'logout': 'bg-gray-100 text-gray-800',
            'CREATE': 'bg-blue-100 text-blue-800',
            'UPDATE': 'bg-purple-100 text-purple-800',
            'DELETE': 'bg-red-100 text-red-800',
            'DOWNLOAD': 'bg-indigo-100 text-indigo-800',
            'UPLOAD': 'bg-orange-100 text-orange-800'
        };
        return styles[action?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const tabs = [
        { id: 'logs', label: 'Activity Logs', icon: '📋' },
        { id: 'uploads', label: 'Report Uploads', icon: '📤' },
        { id: 'downloads', label: 'Report Downloads', icon: '📥' }
    ];

    // Get paginated data
    const getLogs = () => {
        if (!analyticsLogs) return [];
        return Array.isArray(analyticsLogs) ? analyticsLogs : analyticsLogs.logs || [];
    };

    const getUploads = () => {
        if (!analyticsReportUpload) return [];
        return Array.isArray(analyticsReportUpload) ? analyticsReportUpload : analyticsReportUpload.reports || [];
    };

    const getDownloads = () => {
        if (!analyticsReportDownload) return [];
        return Array.isArray(analyticsReportDownload) ? analyticsReportDownload : analyticsReportDownload.reports || [];
    };

    const logs = getLogs();
    const uploads = getUploads();
    const downloads = getDownloads();

    // Get total counts
    const getTotal = (data) => {
        if (!data) return 0;
        if (Array.isArray(data)) return data.length;
        return data.total || data.length || 0;
    };

    const totalLogs = getTotal(analyticsLogs);
    const totalUploads = getTotal(analyticsReportUpload);
    const totalDownloads = getTotal(analyticsReportDownload);

    // Logs Columns
    const logsColumns = [
        {
            field: 'index',
            header: '#',
            body: (rowData, options) => (
                <span>{(page - 1) * limit + options.rowIndex + 1}</span>
            ),
            minWidth: '60px'
        },
        {
            field: 'userName',
            header: 'User',
            body: (rowData) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {rowData.userName || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-500">
                        {rowData.userEmployeeId || ''}
                    </div>
                </div>
            ),
            minWidth: '150px'
        },
        {
            field: 'action',
            header: 'Action',
            body: (rowData) => (
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadge(rowData.action)}`}>
                    {rowData.action?.toUpperCase() || 'N/A'}
                </span>
            ),
            minWidth: '120px'
        },
        {
            field: 'role',
            header: 'Role',
            body: (rowData) => (
                <span className="text-sm text-gray-700 capitalize">
                    {rowData.role?.replace('_', ' ') || 'N/A'}
                </span>
            ),
            minWidth: '120px'
        },
        {
            field: 'date',
            header: 'Date & Time',
            body: (rowData) => (
                <div>
                    <div className="text-sm text-gray-700">{rowData.date || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{rowData.time || ''}</div>
                </div>
            ),
            minWidth: '150px'
        }
    ];

    // Uploads Columns
    const uploadsColumns = [
        {
            field: 'index',
            header: '#',
            body: (rowData, options) => (
                <span>{(page - 1) * limit + options.rowIndex + 1}</span>
            ),
            minWidth: '60px'
        },
        {
            field: 'patientId',
            header: 'Patient',
            body: (rowData) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {rowData.patientId || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                        {rowData.patientName || ''}
                    </div>
                </div>
            ),
            minWidth: '150px'
        },
        {
            field: 'reportType',
            header: 'Report Type',
            body: (rowData) => {
                const reports = Array.isArray(rowData.reportType) ? rowData.reportType : [rowData.reportType];
                return (
                    <div className="flex flex-wrap gap-1">
                        {reports.filter(Boolean).map((type, index) => (
                            <span key={index} className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {type}
                            </span>
                        ))}
                    </div>
                );
            },
            minWidth: '150px'
        },
        {
            field: 'userId',
            header: 'Uploaded By',
            body: (rowData) => {
                const user = rowData.userId || rowData;
                return (
                    <div>
                        <div className="text-sm text-gray-700">
                            {user?.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">
                            {user?.email || ''}
                        </div>
                    </div>
                );
            },
            minWidth: '150px'
        },
        {
            field: 'dateOfUpload',
            header: 'Date',
            body: (rowData) => (
                <div>
                    <div className="text-sm text-gray-700">{rowData.dateOfUpload || rowData.date || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{rowData.time || ''}</div>
                </div>
            ),
            minWidth: '150px'
        }
    ];

    // Downloads Columns
    const downloadsColumns = [
        {
            field: 'index',
            header: '#',
            body: (rowData, options) => (
                <span>{(page - 1) * limit + options.rowIndex + 1}</span>
            ),
            minWidth: '60px'
        },
        {
            field: 'patientId',
            header: 'Patient',
            body: (rowData) => {
                const patient = rowData.patient || rowData;
                return (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {patient?.patientId || rowData.patientId || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                            {patient?.patientName || ''}
                        </div>
                    </div>
                );
            },
            minWidth: '150px'
        },
        {
            field: 'reportType',
            header: 'Report Type',
            body: (rowData) => {
                const reports = Array.isArray(rowData.reportType) ? rowData.reportType : [rowData.reportType];
                return (
                    <div className="flex flex-wrap gap-1">
                        {reports.filter(Boolean).map((type, index) => (
                            <span key={index} className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                {type}
                            </span>
                        ))}
                    </div>
                );
            },
            minWidth: '150px'
        },
        {
            field: 'downloadedBy',
            header: 'Downloaded By',
            body: (rowData) => {
                const user = rowData.downloadedBy || rowData;
                return (
                    <div>
                        <div className="text-sm text-gray-700">
                            {user?.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">
                            {user?.email || ''}
                        </div>
                    </div>
                );
            },
            minWidth: '150px'
        },
        {
            field: 'dateOfDownload',
            header: 'Date',
            body: (rowData) => (
                <div>
                    <div className="text-sm text-gray-700">{rowData.dateOfDownload || rowData.date || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{rowData.time || ''}</div>
                </div>
            ),
            minWidth: '150px'
        }
    ];

    // Get current data based on active tab
    const getCurrentData = () => {
        switch(activeTab) {
            case 'logs': return logs;
            case 'uploads': return uploads;
            case 'downloads': return downloads;
            default: return [];
        }
    };

    // Get current columns based on active tab
    const getCurrentColumns = () => {
        switch(activeTab) {
            case 'logs': return logsColumns;
            case 'uploads': return uploadsColumns;
            case 'downloads': return downloadsColumns;
            default: return [];
        }
    };

    // Get current total based on active tab
    const getCurrentTotal = () => {
        switch(activeTab) {
            case 'logs': return totalLogs;
            case 'uploads': return totalUploads;
            case 'downloads': return totalDownloads;
            default: return 0;
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto pb-12">
                <PagePath title="Analytics" />
                <div className="flex justify-center items-center h-96">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <PagePath title="Analytics" />

            {/* Filters - Auto apply on change */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-end">
                        {/* Clear Filters Button */}
                        {(startDate || endDate || actionFilter) && (
                            <button
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                    setActionFilter('');
                                    setPage(1);
                                }}
                                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Clear Filters ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Action Filter - Only visible when Activity Logs is active */}
                {activeTab === 'logs' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                            <select
                                value={actionFilter}
                                onChange={handleActionFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Actions</option>
                                <option value="login">Login</option>
                                <option value="logout">Logout</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                    <div className="flex flex-wrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                                    activeTab === tab.id
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    {/* DataTable */}
                    <DataTable
                        data={getCurrentData()}
                        columns={getCurrentColumns()}
                        loading={loading}
                        emptyMessage={`No ${activeTab} found`}
                    />

                    {/* Pagination */}
                    <Pagination
                        currentPage={page}
                        totalPages={Math.ceil(getCurrentTotal() / limit) || 1}
                        totalItems={getCurrentTotal()}
                        itemsPerPage={limit}
                        onPageChange={setPage}
                        onItemsPerPageChange={handleLimitChange}
                        showRowPerPage={true}
                    />
                </div>
            </div>
        </div>
    );
}