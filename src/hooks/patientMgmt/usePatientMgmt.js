import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { toast } from "react-toastify";
import { patientDetailsAtom, patientResAtom } from "../../state/patientMgmt/patientMgmtState";

const usePatientMgmt = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [patientRes, setPatientRes] = useRecoilState(patientResAtom);
    const [patientDetails, setPatientDetails] = useRecoilState(patientDetailsAtom);

    const addPatient = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}patients`,
                data,
            });
            if (res) {
                setLoading(false);
                toast.success(res.message);
                return true;
            }
        } catch (error) {
            console.error("Error adding patient:", error);
            setLoading(false);
            toast.error(error.response?.data?.message);
            return false;
        }
    };

    const fetchPatients = async (page, limit, debouncedSearch) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append("page", page);  
            if (limit) params.append("limit", limit);
            if (debouncedSearch) params.append("search", debouncedSearch);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}patients?${params.toString()}`,
            });
            if (res) {
                setLoading(false);
                setPatientRes(res);
                return true;
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
            setLoading(false);
            toast.error(error.response?.data?.message);
            return false;
        }
    };

    const fetchPatientDetails = async (id) => {
        setLoading(true);
        try {   
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}patients/${id}`,
            });
            if (res) {
                setLoading(false);
                setPatientDetails(res?.data);
                return true;
            }
        } catch (error) {
            console.error("Error fetching patient details:", error);
            setLoading(false);
            toast.error(error.response?.data?.message);
            return false;
        }
    };

    const resetPatientDetails = () => {
        setPatientDetails(null);
    }

    const updatePatient = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}patients/${id}`,
                data,
            });
            if (res) {
                setLoading(false);
                toast.success(res.message);
                return true;
            }
        } catch (error) {
            console.error("Error updating patient:", error);
            setLoading(false);
            toast.error(error.response?.data?.message);
            return false;
        }
    };

    return {
        loading,
        patientRes,
        patientDetails,
        addPatient,
        fetchPatients,
        fetchPatientDetails,
        resetPatientDetails,
        updatePatient,
    }
};

export default usePatientMgmt;
