import { useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { toast } from "react-toastify";
import { departmentsAtom, designationsAtom, rolesAtom } from "../../state/dropdown/dropdownState";

const useDropdowns = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useRecoilState(departmentsAtom);
    const [designations, setDesignations] = useRecoilState(designationsAtom);
    const [roles, setRoles] = useRecoilState(rolesAtom);

    const fetchDepartments = useCallback(async (role) => {
        setLoading(true);
        try {
            const url = role
                ? `${conf.apiBaseUrl}users/departments?role=${role}`
                : `${conf.apiBaseUrl}users/departments`;
            const res = await fetchData({
                method: "GET",
                url,
            });
            if (res) {
                setLoading(false);
                setDepartments(Array.isArray(res?.data) ? res.data : []);
                return true;
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
            setLoading(false);
            // toast.error(error.response?.data?.message);
            return false;
        }
    }, [fetchData, setDepartments]);

    const fetchDesignations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}users/designations`,
            });
            if (res) {
                setLoading(false);
                setDesignations(Array.isArray(res?.designations) ? res.designations : []);
                return true;
            }
        } catch (error) {
            console.error("Error fetching designations:", error);
            setLoading(false);
            toast.error(error.response?.data?.message);
            return false;
        }
    }, [fetchData, setDesignations]);

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        try {
            const result = await axios.get(`${conf.apiBaseUrl}users/roles`);
            const res = result.data;
            if (res) {
                setLoading(false);
                setRoles(Array.isArray(res?.roles) ? res.roles : []);
                return true;
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setLoading(false);
            toast.error(error.response?.data?.message);
            return false;
        }
    }, [setLoading, setRoles]);

    // Fetch departments specifically for prescription/treatment form
    const fetchPrescriptionDepartments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}prescriptions/departments`,
            });
            if (res) {
                setLoading(false);
                return Array.isArray(res?.data) ? res.data : [];
            }
        } catch (error) {
            console.error("Error fetching prescription departments:", error);
            setLoading(false);
            return [];
        }
    }, [fetchData]);

    // Fetch doctors specifically for prescription/treatment form based on department
    const fetchPrescriptionDoctors = useCallback(async (department) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}prescriptions/doctors?Department=${encodeURIComponent(department)}`,
            });
            if (res) {
                setLoading(false);
                return Array.isArray(res?.data) ? res.data : [];
            }
        } catch (error) {
            console.error("Error fetching prescription doctors:", error);
            setLoading(false);
            return [];
        }
    }, [fetchData]);

    return {
        loading,
        departments,
        designations,
        roles,
        fetchDepartments,
        fetchDesignations,
        fetchRoles,
        fetchPrescriptionDepartments,
        fetchPrescriptionDoctors
    };
};

export default useDropdowns;
