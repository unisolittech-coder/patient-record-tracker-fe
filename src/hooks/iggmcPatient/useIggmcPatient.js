import { useCallback ,useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { toast } from "react-toastify";
import { igmcPatientAtom, igmcPatientResAtom } from "../../state/iggmcPatient/iggmcPatientState";

export const useIggmcPatient = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useRecoilState(igmcPatientAtom);
    const [patientRes, setPatientRes] = useRecoilState(igmcPatientResAtom);

    const createPatient = useCallback(async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}iggmc-patients/create`,
                data,
            });
            if (res) {
                setLoading(false);
                setPatientRes(res);
                toast.success(res.message || "Patient created successfully");
                return true;
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "Failed to create patient");
            return false;
        }
    }, [fetchData, setPatientRes]);

    const fetchPatientByUhid = useCallback(async (uhid) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}iggmc-patients/${uhid}`,
            });
            if (res) {
                setLoading(false);
                const patientData = res?.patient || res?.data || null;
                setPatient(patientData);
                setPatientRes(res);
                return patientData;
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "Failed to fetch patient");
            setPatient(null);
            setPatientRes(null);
            return null;
        }
    }, [fetchData, setPatient, setPatientRes]);

    const resetPatientDetails = useCallback(() => {
        setPatient(null);
        setPatientRes(null);
    }, [setPatient, setPatientRes]);

    return {
        loading,
        patient,
        patientRes,
        createPatient,
        fetchPatientByUhid,
        resetPatientDetails
    };
};
