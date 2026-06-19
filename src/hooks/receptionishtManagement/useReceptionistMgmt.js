import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { toast } from "react-toastify";
import { receptionistDetailsAtom, receptionistResAtom } from "../../state/receptionistMgmt/receptionistMgmtState";

const useReceptionistMgmt = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [receptionistRes, setReceptionistRes] = useRecoilState(receptionistResAtom);
    const [receptionistDetails, setReceptionistDetails] = useRecoilState(receptionistDetailsAtom);

    const addReceptionist = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}users`,
                data,
            });
            if (res) {
                setLoading(false);
                toast.success(res.message);
                return true;
            }
        } catch (error) {
            console.error("Error adding receptionist:", error);
            setLoading(false);
            toast.error(error.response?.data?.message);
            return false;
        }
    };

    const fetchReceptionists = async (page, limit, debouncedSearch) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);
            if (debouncedSearch) params.append("name", debouncedSearch);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}users?${params.toString()}`,
            });
            if (res) {
                setLoading(false);
                setReceptionistRes(res);
                return true;
            }
        } catch (error) {
            console.error("Error fetching receptionists:", error);
            setLoading(false);
            return false;
        }
    };

    const fetchReceptionistDetails = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}users/${id}`,
            });
            if (res) {
                setLoading(false);
                setReceptionistDetails(res);
                return true;
            }
        } catch (error) {
            console.error("Error fetching receptionist details:", error);
            setLoading(false);
            return false;
        }
    };

    const updateReceptionist = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}users/${id}`,
                data,
            });
            if (res) {
                setLoading(false);
                toast.success(res.message);
                return true;
            }
        } catch (error) {
            console.error("Error updating receptionist:", error);
            setLoading(false);
            toast.error(error.response?.data?.message);
            return false;
        }
    };

    const resetReceptionistDetails = () => {
        setReceptionistDetails(null);
    };

    return {
        loading,
        receptionistRes,
        receptionistDetails,
        addReceptionist,
        fetchReceptionists, 
        fetchReceptionistDetails,
        updateReceptionist,
        resetReceptionistDetails
    };
}

export default useReceptionistMgmt;
