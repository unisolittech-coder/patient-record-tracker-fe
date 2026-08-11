import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useDoctorManagement from '../../../hooks/doctorManagment/useDoctorManagement';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import useDebounce from '../../../hooks/debounce/useDebounce';
import PatientDetailsCard from './PatientDetailsCard';
import MedicalHistory from './MedicalHistory';
import TreatmentForm from './TreatmentForm';

export default function DoctorPatientManagement() {
    const navigate = useNavigate();
    const {
        loading,
        error,
        patientData,
        patientHistory,
        departments,
        searchPatient,
        fetchPatientById,
        fetchPatientHistory,
        submitPrescription,   // ✅ This is the correct method
        assignPatient,
        fetchDepartments,
        clearPatientData
    } = useDoctorManagement();

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [localSearchResults, setLocalSearchResults] = useState([]);

    const breadcrumbPaths = [
        { label: 'Patient Management' },
        { label: 'Patient List' }
    ];

    // Load initial data
    useEffect(() => {
        fetchDepartments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle search
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearch.trim()) {
                const result = await searchPatient(debouncedSearch.trim());
                if (result) {
                    const patients = result?.data || [];
                    setLocalSearchResults(patients);
                    if (patients.length === 1) {
                        const patient = patients[0];
                        setSelectedPatient(patient);
                        await fetchPatientHistory(patient.patientId || patient.id);
                        toast.success('Patient found!');
                    } else if (patients.length > 1) {
                        toast.info(`Found ${patients.length} patients. Please select one.`);
                    } else {
                        toast.error('No patient found');
                    }
                }
            } else {
                setLocalSearchResults([]);
            }
        };
        performSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

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

    // Clear all patient data from page
    const handleClearAll = () => {
        clearPatientData();
        setSelectedPatient(null);
        setSearch('');
    };

    // Handle patient selection from search results
    const handleSelectSearchResult = async (patient) => {
        setSelectedPatient(patient);
        await fetchPatientById(patient.patientId || patient.id);
        await fetchPatientHistory(patient.patientId || patient.id);
    };

    // Handle prescription submission with full clear on success
    const handlePrescriptionSubmit = async (prescriptionData) => {
        const result = await submitPrescription(prescriptionData);
        if (result) {
            toast.success('Prescription saved successfully!');
            handleClearAll();
        }
        return result;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <BreadCrumb paths={breadcrumbPaths} />

            <PagePath
                title="Patient Management"
                showSearchBar={true}
                searchValue={search}
                searchPlaceholder="Search by Patient ID"
                onSearch={setSearch}
            >
                {selectedPatient && (
                    <button
                        onClick={handleClearAll}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                    >
                        <i className="pi pi-times"></i>
                        Clear
                    </button>
                )}
            </PagePath>

            {/* Search Results */}
            {localSearchResults.length > 0 && !selectedPatient && (
                <div className="mt-4 bg-white rounded-2xl shadow-lg p-4">
                    <p className="text-sm text-gray-500 mb-3">
                        Found {localSearchResults.length} patient(s)
                    </p>
                    <div className="space-y-2">
                        {localSearchResults.map((patient) => (
                            <div
                                key={patient.id}
                                onClick={() => handleSelectSearchResult(patient)}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                        {patient.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {patient.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
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
                            onSubmit={handlePrescriptionSubmit}
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
                    <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="pi pi-search text-4xl text-blue-500"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Search for a Patient
                        </h3>
                        <p className="text-gray-500">
                            Enter Patient ID to get started
                        </p>
                        <div className="mt-6 text-sm text-gray-400">
                            <p>Example: 2026002</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3 text-red-700">
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
    );
}