import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useDoctorManagement from '../../../hooks/doctorManagment/useDoctorManagement';
import PatientSearch from './PatientSearch';
import PatientDetailsCard from './PatientDetailsCard';
import MedicalHistory from './MedicalHistory';
import TreatmentForm from './TreatmentForm';

export default function DoctorPatientManagement() {
    const navigate = useNavigate();
    const {
        loading,
        error,
        patientData,
        searchResults,
        patientHistory,
        departments,
        doctorsList,
        searchPatient,
        fetchPatientById,
        fetchPatientHistory,
        submitPrescription,   // ✅ This is the correct method
        assignPatient,
        fetchDepartments,
        clearPatientData
    } = useDoctorManagement();

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchKey, setSearchKey] = useState(0);

    // Load initial data
    useEffect(() => {
        fetchDepartments();
    }, []);

    // Handle patient search
    const handlePatientSearch = async (searchTerm) => {
        if (!searchTerm.trim()) {
            toast.error('Please enter a search term');
            return;
        }

        const result = await searchPatient(searchTerm.trim());
        if (result) {
            if (result.data?.length === 1) {
                const patient = result.data[0];
                setSelectedPatient(patient);
                await fetchPatientHistory(patient.patientId || patient.id);
                toast.success('Patient found!');
            } else if (result.data?.length > 1) {
                toast.info(`Found ${result.data.length} patients. Please select one.`);
            } else {
                toast.error('No patient found');
            }
        }
    };

    // Handle patient selection from search results
    const handleSelectPatient = async (patient) => {
        console.log('Selected patient:', patient);
        setSelectedPatient(patient);
        await fetchPatientById(patient.patientId || patient.id);
        await fetchPatientHistory(patient.patientId || patient.id);
    };

    // Handle patient assignment/referral
    const handleAssignPatient = async (departmentId, doctorId) => {
        if (!selectedPatient) {
            toast.error('Please select a patient first');
            return;
        }

        const patientId = selectedPatient.patientId || selectedPatient.id;
        
        const result = await assignPatient(patientId, {
            department: departmentId,
            doctor: doctorId,
            assignedBy: sessionStorage.getItem('id')
        });
        
        if (result) {
            toast.success(`Patient assigned successfully!`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Patient Management
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Search, view, and manage patient prescriptions
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {/* <button
                            onClick={() => navigate('/patient-registration')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <i className="pi pi-user-plus"></i>
                            New Patient
                        </button> */}
                        {selectedPatient && (
                            <button
                                onClick={() => {
                                    clearPatientData();
                                    setSelectedPatient(null);
                                    setSearchKey(prev => prev + 1);
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                            >
                                <i className="pi pi-times"></i>
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Section */}
                <PatientSearch 
                    key={searchKey}
                    onSearch={handlePatientSearch} 
                    loading={loading} 
                    results={searchResults}
                    onSelectPatient={handleSelectPatient}
                />

                {selectedPatient && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        {/* Left Column - Patient Info & History */}
                        <div className="lg:col-span-1 space-y-4">
                            <PatientDetailsCard patient={patientData || selectedPatient} />
                            <MedicalHistory history={patientHistory} />
                        </div>

                        {/* Right Column - Treatment Form */}
                        <div className="lg:col-span-2">
                            <TreatmentForm
                                patient={selectedPatient}
                                onSubmit={submitPrescription}
                                onAssign={handleAssignPatient}
                                departments={departments}
                                loading={loading}
                            />
                        </div>
                    </div>
                )}

                {/* No Patient Selected State */}
                {!selectedPatient && !loading && !error && (
                    <div className="mt-12 text-center">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-search text-4xl text-blue-500"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                Search for a Patient
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Enter Patient ID, Phone Number, or Name to get started
                            </p>
                            <div className="mt-6 text-sm text-gray-400">
                                <p>Example: 2026002 or 8329244185</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                            <i className="pi pi-exclamation-circle text-xl"></i>
                            <p>{error}</p>
                            {error.includes('Session expired') && (
                                <button
                                    onClick={() => navigate('/')}
                                    className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Login Again
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}