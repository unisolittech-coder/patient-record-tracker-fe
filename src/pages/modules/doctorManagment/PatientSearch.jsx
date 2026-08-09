import React, { useState } from 'react';

export default function PatientSearch({ onSearch, loading, results, onSelectPatient }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('id');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm.trim());
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="pi pi-search text-gray-400"></i>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Patient ID, Phone, or Name..."
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        />
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="id">Patient ID</option>
                        <option value="phone">Phone</option>
                        <option value="name">Name</option>
                    </select>
                    
                    <button
                        type="submit"
                        disabled={!searchTerm.trim() || loading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <i className="pi pi-spin pi-spinner"></i>
                                Searching...
                            </>
                        ) : (
                            <>
                                <i className="pi pi-search"></i>
                                Search
                            </>
                        )}
                    </button>
                </div>
            </form>
            
            {/* Search Results */}
            {results && results.length > 0 && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Found {results.length} patient(s)
                    </p>
                    <div className="space-y-2">
                        {results.map((patient) => (
                            <div
                                key={patient.id}
                                onClick={() => onSelectPatient(patient)}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                        {patient.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white">
                                            {patient.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {patient.patientId} • {patient.phone}
                                        </p>
                                    </div>
                                </div>
                                <i className="pi pi-chevron-right text-gray-400"></i>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}