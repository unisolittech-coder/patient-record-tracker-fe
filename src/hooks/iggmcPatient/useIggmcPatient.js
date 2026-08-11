import { useState } from "react";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { toast } from "react-toastify";

export const useIggmcPatient = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);

    const createPatient = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}iggmc-patients/create`,
                data,
            });
            if (res) {
                setLoading(false);
                toast.success(res.message || "Patient created successfully");
                return true;
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "Failed to create patient");
            return false;
        }
    };

    return {
        loading,
        createPatient
    };
};
