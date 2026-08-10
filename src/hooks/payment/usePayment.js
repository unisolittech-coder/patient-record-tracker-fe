import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { toast } from "react-toastify";
import { paymentCollectorPatientAtom } from "../../state/payment/paymentState";

const usePayment = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [paymentCollectorPatient, setPaymentCollectorPatient] = useRecoilState(paymentCollectorPatientAtom);

    const fetchPaymentCollectorPatients = async (debouncedSearch) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append("patientId ", debouncedSearch);

            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}payment-collector?${params.toString()}`,
            });
            if (res) {
                setLoading(false);
                setPaymentCollectorPatient(res);
                return true;
            }
        } catch (error) {
            console.error("Error fetching payment collector patients:", error);
            setLoading(false);
            return false;
        }
    };

    const updatePaymentCollectionStatus = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}payment-collector/${id}`,
                data,
            });
            if (res) {
                setLoading(false);
                toast.success(res.message);
                return true;
            }
        } catch (error) {
            console.error("Error updating payment collection status:", error);
            setLoading(false);
            toast.error(error.response?.data?.message);
            return false;
        }
    };

    return { paymentCollectorPatient, loading, fetchPaymentCollectorPatients, updatePaymentCollectionStatus };
}

export default usePayment;