import { useCallback } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../../hooks/useFetch";
import { toast } from "react-toastify";
import {
    labOperatorLoadingAtom,
    labOperatorErrorAtom,
    labOperatorFormAtom,
    labPatientSearchAtom
} from "../../../state/lab/labOperatorState";

const useLabOperatorManagment = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useRecoilState(labOperatorLoadingAtom);
    const [error, setError] = useRecoilState(labOperatorErrorAtom);
    const [formData, setFormData] = useRecoilState(labOperatorFormAtom);
    const [labPatientSearch, setLabPatientSearch] = useRecoilState(labPatientSearchAtom);

    const submitLabReports = useCallback(async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}lab-operators`,
                data: payload,
            });

            if (res) {
                setLoading(false);
                toast.success(res.message || "Lab reports submitted successfully");
                return res;
            }
        } catch (error) {
            console.error("Error submitting lab reports:", error);
            setLoading(false);
            setError(error.message || "Failed to submit lab reports");
            toast.error(error.response?.data?.message || "Failed to submit lab reports");
            return false;
        }
    }, [fetchData, setLoading, setError]);

    const resetForm = useCallback(() => {
        setFormData({
            uniqueId: "",
            tests: [{ testName: "", report: null }]
        });
        setError(null);
    }, [setFormData, setError]);

    const fetchLabPatientSearch = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}lab-operators/patient/${id}`,
            });
            if (res) {
                setLabPatientSearch(res.patient);
                setLoading(false);
                return true;
            }
            setLoading(false);
            return false;
        } catch (error) {
            console.error("Error fetching lab patient search:", error);
            toast.error(error.response?.data?.message);
            setLoading(false);
            setLabPatientSearch(null);
            return false;
        }
    }

    return {
        loading,
        error,
        formData,
        setFormData,
        submitLabReports,
        resetForm,
        fetchLabPatientSearch,
        labPatientSearch
    };
};

export default useLabOperatorManagment;
