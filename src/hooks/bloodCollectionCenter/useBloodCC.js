import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { bloodTestAtom } from "../../state/bloodCC/bloodCCState";
import { toast } from "react-toastify";

const useBloodCC = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [bloodTest, setBloodTest] = useRecoilState(bloodTestAtom);

    const fetchBloodTest = async (debouncedSearch) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append("patientId", debouncedSearch);

            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}blood-collection-operator/get-tests?${params.toString()}`,
            });
            if (res) {
                setBloodTest(res);
            }
        } catch (error) {
            console.error("Error fetching blood tests:", error);
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return { fetchBloodTest, loading, bloodTest };
}

export default useBloodCC