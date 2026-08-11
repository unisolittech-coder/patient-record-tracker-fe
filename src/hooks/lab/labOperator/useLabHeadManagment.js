import { useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import { toast } from "react-toastify";
import {
    labHeadResAtom,
    labHeadDetailsAtom,
    labHeadLoadingAtom,
    labHeadErrorAtom
} from "../../../state/labHead/labHeadState";

const useLabHeadManagment = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useRecoilState(labHeadLoadingAtom);
    const [error, setError] = useRecoilState(labHeadErrorAtom);

    const [labHeadRes, setLabHeadRes] = useRecoilState(labHeadResAtom);
    const [labHeadDetails, setLabHeadDetails] = useRecoilState(labHeadDetailsAtom);

    const fetchLabHeads = useCallback(async (page, limit, debouncedSearch) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);
            if (debouncedSearch) params.append("search", debouncedSearch);

            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}lab-head?${params.toString()}`,
            });

            if (res) {
                setLoading(false);
                setLabHeadRes(res);
                return res;
            }
        } catch (error) {
            console.error("Error fetching lab heads:", error);
            setLoading(false);
            setError(error.message || "Failed to fetch lab heads");
            return false;
        }
    }, [fetchData, setLoading, setError, setLabHeadRes]);

    const fetchLabHeadDetails = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}lab-head/${id}`,
            });

            if (res) {
                setLoading(false);
                setLabHeadDetails(res);
                return res;
            }
        } catch (error) {
            console.error("Error fetching lab head details:", error);
            setLoading(false);
            setError(error.message || "Failed to fetch lab head details");
            return false;
        }
    }, [fetchData, setLoading, setError, setLabHeadDetails]);

    const addLabHead = useCallback(async (data) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}lab-head`,
                data,
            });

            if (res) {
                setLoading(false);
                toast.success(res.message || "Lab head added successfully");
                return res;
            }
        } catch (error) {
            console.error("Error adding lab head:", error);
            setLoading(false);
            setError(error.message || "Failed to add lab head");
            toast.error(error.response?.data?.message || "Failed to add lab head");
            return false;
        }
    }, [fetchData, setLoading, setError]);

    const updateLabHead = useCallback(async (id, data) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}lab-head/${id}`,
                data,
            });

            if (res) {
                setLoading(false);
                toast.success(res.message || "Lab head updated successfully");
                return res;
            }
        } catch (error) {
            console.error("Error updating lab head:", error);
            setLoading(false);
            setError(error.message || "Failed to update lab head");
            toast.error(error.response?.data?.message || "Failed to update lab head");
            return false;
        }
    }, [fetchData, setLoading, setError]);

    const deleteLabHead = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetchData({
                method: "DELETE",
                url: `${conf.apiBaseUrl}lab-head/${id}`,
            });

            if (res) {
                setLoading(false);
                toast.success(res.message || "Lab head deleted successfully");
                return res;
            }
        } catch (error) {
            console.error("Error deleting lab head:", error);
            setLoading(false);
            setError(error.message || "Failed to delete lab head");
            toast.error(error.response?.data?.message || "Failed to delete lab head");
            return false;
        }
    }, [fetchData, setLoading, setError]);

    const fetchLabHeadReport = useCallback(async (uniqueId) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}lab-head/report/${uniqueId}`,
            });

            if (res) {
                setLoading(false);
                return res;
            }
        } catch (error) {
            console.error("Error fetching lab head report:", error);
            setLoading(false);
            setError(error.message || "Failed to fetch lab head report");
            return false;
        }
    }, [fetchData, setLoading, setError]);

    const resetLabHeadDetails = useCallback(() => {
        setLabHeadDetails(null);
        setError(null);
    }, [setLabHeadDetails, setError]);

    return {
        loading,
        error,
        labHeadRes,
        labHeadDetails,
        fetchLabHeads,
        fetchLabHeadDetails,
        fetchLabHeadReport,
        addLabHead,
        updateLabHead,
        deleteLabHead,
        resetLabHeadDetails
    };
};

export default useLabHeadManagment;
