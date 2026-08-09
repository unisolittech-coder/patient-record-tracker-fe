import React from 'react';

export default function PatientDetailsCard({ patient }) {
    if (!patient) return null;

    // ✅ Map API response fields to display fields
    const displayData = {
        name: patient.patientName || patient.name || 'N/A',
        patientId: patient.patientId || patient.id || 'N/A',
        phone: patient.mobileNumber || patient.phone || 'N/A',
        gender: patient.gender || 'N/A',
        age: patient.age || 'N/A',
        aadhaar: patient.aadhaarNumber || patient.aadhaar || 'N/A',
        department: patient.referToDepartment || patient.department || 'N/A',
        doctor: patient.doctorName || patient.doctor || 'N/A',
        email: patient.email || 'N/A',
        bloodGroup: patient.bloodGroup || 'N/A',
        registrationDate: patient.registrationDate || 'N/A',
        lastVisit: patient.lastVisit || 'N/A',
        status: patient.status || 'Active'
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {displayData.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {displayData.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {displayData.patientId}
                    </p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                    displayData.status === 'Active' || displayData.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                    {displayData.status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {displayData.phone}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {displayData.gender}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Age</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {displayData.age} years
                        </p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {displayData.department}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Doctor</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {displayData.doctor}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Aadhaar</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {displayData.aadhaar || 'Not provided'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Info Tags */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                        <i className="pi pi-calendar mr-1"></i>
                        Reg: {displayData.registrationDate}
                    </span>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-lg">
                    <span className="text-xs text-purple-600 dark:text-purple-400">
                        <i className="pi pi-tag mr-1"></i>
                        {displayData.department}
                    </span>
                </div>
                {displayData.bloodGroup !== 'N/A' && (
                    <div className="bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg">
                        <span className="text-xs text-red-600 dark:text-red-400">
                            <i className="pi pi-heart mr-1"></i>
                            Blood: {displayData.bloodGroup}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}