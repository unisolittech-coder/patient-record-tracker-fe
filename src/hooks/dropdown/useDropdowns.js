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

    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}users/departments`,
            });
            if (res) {
                setLoading(false);
                setDepartments(Array.isArray(res?.departments) ? res.departments : []);
                return true;
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
            setLoading(false);
            toast.error(error.response?.data?.message);
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

    return {
        loading,
        departments,
        designations,
        roles,
        fetchDepartments,
        fetchDesignations,
        fetchRoles
    };
};

export default useDropdowns;
