import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { 
    patientDataAtom, 
    patientSearchResultsAtom,
    patientHistoryAtom,
    currentTreatmentAtom,
    labTestsAtom,
    departmentsAtom,
    doctorsListAtom,
    patientLoadingAtom,
    patientErrorAtom
} from "../../state/doctor/doctorState";

const useDoctorManagement = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useRecoilState(patientLoadingAtom);
    const [error, setError] = useRecoilState(patientErrorAtom);
    
    // Recoil states
    const [patientData, setPatientData] = useRecoilState(patientDataAtom);
    const [searchResults, setSearchResults] = useRecoilState(patientSearchResultsAtom);
    const [patientHistory, setPatientHistory] = useRecoilState(patientHistoryAtom);
    const [currentTreatment, setCurrentTreatment] = useRecoilState(currentTreatmentAtom);
    const [labTests, setLabTests] = useRecoilState(labTestsAtom);
    const [departments, setDepartments] = useRecoilState(departmentsAtom);
    const [doctorsList, setDoctorsList] = useRecoilState(doctorsListAtom);

    // Search patient by ID, phone, or name
    const searchPatient = async (searchTerm) => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}patients?search=${searchTerm}`,
            });
            
            if (res) {
                setLoading(false);
                const patients = res?.data || [];
                setSearchResults(patients);
                
                if (patients.length === 1) {
                    setPatientData(patients[0]);
                } else if (patients.length > 1) {
                    setPatientData(null);
                } else {
                    setPatientData(null);
                    setError('No patient found with this search term');
                }
                
                return res;
            }
        } catch (error) {
            console.error("Error searching patient:", error);
            setLoading(false);
            setError(error.message || "Failed to search patient");
            setSearchResults([]);
            setPatientData(null);
            return false;
        }
    };

    // Fetch patient by ID directly
    const fetchPatientById = async (patientId) => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}patients/${patientId}`,
            });
            
            if (res) {
                setLoading(false);
                setPatientData(res?.data || res);
                return res?.data || res;
            }
        } catch (error) {
            console.error("Error fetching patient:", error);
            setLoading(false);
            setError(error.message || "Failed to fetch patient");
            return false;
        }
    };

    // Fetch patient medical history
    const fetchPatientHistory = async (patientId) => {
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}patients/getpatientHistory/${patientId}`,
            });
            
            if (res) {
                const historyObj = res?.data?.history || {};
                const normalizedHistory = [];
                Object.entries(historyObj).forEach(([date, records]) => {
                    const items = Array.isArray(records) ? records : [records];
                    items.forEach(record => {
                        normalizedHistory.push({
                            ...record,
                            date
                        });
                    });
                });
                setPatientHistory(normalizedHistory);
                return res?.data;
            }
        } catch (error) {
            console.error("Error fetching patient history:", error);
            setPatientHistory([]);
            return false;
        }
    };

    // ✅ SUBMIT PRESCRIPTION - CORRECT API ENDPOINT
    const submitPrescription = async (prescriptionData) => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}prescriptions`,
                data: prescriptionData
            });
            
            if (res) {
                setLoading(false);
                return res?.data;
            }
        } catch (error) {
            console.error("Error submitting prescription:", error);
            setLoading(false);
            setError(error.message || "Failed to submit prescription");
            return false;
        }
    };

    // ✅ SAVE TREATMENT - DEPRECATED, but kept for compatibility
    const saveTreatment = async (patientId, treatmentData) => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}patients/${patientId}/treatment`,
                data: treatmentData
            });
            
            if (res) {
                setLoading(false);
                setCurrentTreatment(res?.data);
                await fetchPatientHistory(patientId);
                return res?.data;
            }
        } catch (error) {
            console.error("Error saving treatment:", error);
            setLoading(false);
            setError(error.message || "Failed to save treatment");
            return false;
        }
    };

    // Order lab tests
    const orderLabTests = async (patientId, testData) => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}patients/${patientId}/lab-tests`,
                data: testData
            });
            
            if (res) {
                setLoading(false);
                setLabTests(res?.data?.tests || []);
                return res?.data;
            }
        } catch (error) {
            console.error("Error ordering lab tests:", error);
            setLoading(false);
            setError(error.message || "Failed to order lab tests");
            return false;
        }
    };

    // Assign patient to department/doctor
    const assignPatient = async (patientId, assignData) => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}patients/${patientId}/assign`,
                data: assignData
            });
            
            if (res) {
                setLoading(false);
                return res?.data;
            }
        } catch (error) {
            console.error("Error assigning patient:", error);
            setLoading(false);
            setError(error.message || "Failed to assign patient");
            return false;
        }
    };

    // Fetch available lab tests
    const fetchAvailableLabTests = async () => {
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}lab-tests/available`,
            });
            
            if (res) {
                setLabTests(res?.data?.tests || res?.data || []);
                return res?.data;
            }
        } catch (error) {
            console.error("Error fetching lab tests:", error);
            return false;
        }
    };

    // Fetch departments
    const fetchDepartments = async () => {
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}departments`,
            });
            
            if (res) {
                setDepartments(res?.data?.departments || res?.data || []);
                return res?.data;
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
            return false;
        }
    };

    // Fetch doctors by department
    const fetchDoctorsByDepartment = async (departmentId) => {
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}departments/${departmentId}/doctors`,
            });
            
            if (res) {
                setDoctorsList(res?.data?.doctors || res?.data || []);
                return res?.data;
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            return false;
        }
    };

    // Clear patient data (reset state)
    const clearPatientData = () => {
        setPatientData(null);
        setSearchResults([]);
        setPatientHistory([]);
        setCurrentTreatment(null);
        setError(null);
    };

    return {
        loading,
        error,
        patientData,
        searchResults,
        patientHistory,
        currentTreatment,
        labTests,
        departments,
        doctorsList,
        
        // Methods
        searchPatient,
        fetchPatientById,
        fetchPatientHistory,
        saveTreatment,
        submitPrescription,   // ✅ ADD THIS - Main method for prescription
        orderLabTests,
        assignPatient,
        fetchAvailableLabTests,
        fetchDepartments,
        fetchDoctorsByDepartment,
        clearPatientData
    };
};

export default useDoctorManagement;