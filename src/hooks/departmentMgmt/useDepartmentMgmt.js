import { useState } from "react";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { toast } from "react-toastify";

const useDepartmentMgmt = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [departmentRes, setDepartmentRes] = useState([]);
    const [departmentDetails, setDepartmentDetails] = useState(null);

    // POST - create department
    const addDepartment = async (data) => {
        setLoading(true);

        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}department-management`,
                data,
            });

            if (res) {
                toast.success(res.message || "Department added successfully");
                return res;
            }
        } catch (error) {
            console.error("Error adding department:", error);
            toast.error(
                error.response?.data?.message ||
                "Failed to add department"
            );
            return false;
        } finally {
            setLoading(false);
        }
    };

    // GET - list all departments
    const fetchDepartments = async () => {
        setLoading(true);

        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}department-management`,
            });

            if (res) {
                const data = Array.isArray(res)
                    ? res
                    : res?.data || [];

                setDepartmentRes(data);
                return data;
            }

            return [];
        } catch (error) {
            console.error("Error fetching departments:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // GET - dropdown
    const fetchDepartmentDropdown = async () => {
        setLoading(true);

        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}department-management/dropdown`,
            });

            if (res) {
                const data = Array.isArray(res)
                    ? res
                    : res?.data || [];

                return data;
            }

            return [];
        } catch (error) {
            console.error("Error fetching department dropdown:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // GET - single department details
    const fetchDepartmentDetails = async (id) => {
        setLoading(true);

        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}department-management/${id}`,
            });

            if (res) {
                setDepartmentDetails(res);
                return res;
            }

            return false;
        } catch (error) {
            console.error("Error fetching department details:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // PUT - update department
    const updateDepartment = async (id, data) => {
        setLoading(true);

        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}department-management/${id}`,
                data,
            });

            if (res) {
                toast.success(
                    res.message || "Department updated successfully"
                );
                return res;
            }

            return false;
        } catch (error) {
            console.error("Error updating department:", error);
            toast.error(
                error.response?.data?.message ||
                "Failed to update department"
            );
            return false;
        } finally {
            setLoading(false);
        }
    };

    // DELETE - delete department
    const deleteDepartment = async (id) => {
        setLoading(true);

        try {
            const res = await fetchData({
                method: "DELETE",
                url: `${conf.apiBaseUrl}department-management/${id}`,
            });

            if (res) {
                toast.success(
                    res.message || "Department deleted successfully"
                );
                return res;
            }

            return false;
        } catch (error) {
            console.error("Error deleting department:", error);
            toast.error(
                error.response?.data?.message ||
                "Failed to delete department"
            );
            return false;
        } finally {
            setLoading(false);
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
        resetDepartmentDetails,
    };
};

export default useDepartmentMgmt;