import { useState } from "react";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { toast } from "react-toastify";

const DETAILS_API_BASE = "https://patient-record-tracker-be.onrender.com/api/department-management";

const useDepartmentMgmt = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [departmentRes, setDepartmentRes] = useState([]);
    const [departmentDetails, setDepartmentDetails] = useState(null);

    // POST - create new department (gmc-cleaning-backend)
    const addDepartment = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: DETAILS_API_BASE,
                data,
            });
            if (res) {
                setLoading(false);
                toast.success(res.message || "Department added successfully");
                return res;
            }
        } catch (error) {
            console.error("Error adding department:", error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Failed to add department");
            return false;
        }
    };

    // GET - list all departments (patient-record-tracker-be)
    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}department-management`,
            });
            if (res) {
                setLoading(false);
                const data = Array.isArray(res) ? res : (res?.data || []);
                setDepartmentRes(data);
                return data;
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
            setLoading(false);
            return false;
        }
    };

    // GET - dropdown (patient-record-tracker-be)
    const fetchDepartmentDropdown = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}department-management/dropdown`,
            });
            if (res) {
                setLoading(false);
                const data = Array.isArray(res) ? res : (res?.data || []);
                return data;
            }
        } catch (error) {
            console.error("Error fetching department dropdown:", error);
            setLoading(false);
            return false;
        }
    };

    // GET - single department details (gmc-cleaning-backend)
    const fetchDepartmentDetails = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${DETAILS_API_BASE}/${id}`,
            });
            if (res) {
                setLoading(false);
                setDepartmentDetails(res);
                return res;
            }
        } catch (error) {
            console.error("Error fetching department details:", error);
            setLoading(false);
            return false;
        }
    };

    // PUT - update department (gmc-cleaning-backend)
    const updateDepartment = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${DETAILS_API_BASE}/${id}`,
                data,
            });
            if (res) {
                setLoading(false);
                toast.success(res.message || "Department updated successfully");
                return res;
            }
        } catch (error) {
            console.error("Error updating department:", error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Failed to update department");
            return false;
        }
    };

    // DELETE - delete department (gmc-cleaning-backend)
    const deleteDepartment = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "DELETE",
                url: `${DETAILS_API_BASE}/${id}`,
            });
            if (res) {
                setLoading(false);
                toast.success(res.message || "Department deleted successfully");
                return res;
            }
        } catch (error) {
            console.error("Error deleting department:", error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Failed to delete department");
            return false;
        }
    };

    const resetDepartmentDetails = () => {
        setDepartmentDetails(null);
    };

    return {
        loading,
        departmentRes,
        departmentDetails,
        addDepartment,
        fetchDepartments,
        fetchDepartmentDropdown,
        fetchDepartmentDetails,
        updateDepartment,
        deleteDepartment,
        resetDepartmentDetails
    };
}

export default useDepartmentMgmt;