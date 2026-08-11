import { useCallback } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../../hooks/useFetch";
import { toast } from "react-toastify";
import {
    labOperatorLoadingAtom,
    labOperatorErrorAtom,
    labOperatorFormAtom
} from "../../../state/lab/labOperatorState";

const useLabOperatorManagment = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useRecoilState(labOperatorLoadingAtom);
    const [error, setError] = useRecoilState(labOperatorErrorAtom);
    const [formData, setFormData] = useRecoilState(labOperatorFormAtom);

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

    return {
        loading,
        error,
        formData,
        setFormData,
        submitLabReports,
        resetForm
    };
};

export default useLabOperatorManagment;
