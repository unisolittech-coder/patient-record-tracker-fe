import React, { useState } from 'react';

export default function MedicalHistory({ history }) {
    const [expandedItems, setExpandedItems] = useState({});

    if (!history || history.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                    <i className="pi pi-history mr-2 text-blue-500"></i>
                    Medical History
                </h3>
                <div className="text-center py-8 text-gray-500">
                    <i className="pi pi-inbox text-4xl mb-2 block"></i>
                    <p>No medical history found</p>
                </div>
            </div>
        );
    }

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                <i className="pi pi-history mr-2 text-blue-500"></i>
                Medical History
                <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({history.length} records)
                </span>
            </h3>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {history.map((record, index) => (
                    <div 
                        key={record._id || index}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition"
                    >
                        <button
                            onClick={() => toggleExpand(record._id || index)}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-1">
                                    <i className="pi pi-calendar text-xs"></i>
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {record.date || `Visit ${index + 1}`}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {record.prescription ? 'Prescription Available' : 'No prescription recorded'}
                                    </p>
                                    {record.familyHistory && (
                                        <p className="text-xs text-gray-400">
                                            Family History Recorded
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    record.paymentStatus === 'paid'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                    {record.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                </span>
                                <i className={`pi ${expandedItems[record._id || index] ? 'pi-chevron-up' : 'pi-chevron-down'} text-gray-400`}></i>
                            </div>
                        </button>

                        {expandedItems[record._id || index] && (
                            <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                                {record.prescription && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Prescription</p>
                                        <p className="text-sm text-gray-800 dark:text-white">{record.prescription}</p>
                                    </div>
                                )}
                                
                                {record.tests && record.tests.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Lab Tests Ordered</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {record.tests.map((test, i) => (
                                                <span key={i} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded">
                                                    {test.testName} ({test.paymentStatus})
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {record.familyHistory && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Family History</p>
                                        <p className="text-sm text-gray-800 dark:text-white">{record.familyHistory}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}