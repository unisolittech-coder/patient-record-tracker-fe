import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { toast } from "react-toastify";
import { adminResAtom, authAtom, receptionistResAtom } from "../../state/auth/authState";

export const useLogin = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const setAuthState = useSetRecoilState(authAtom);
    const [adminRes, setAdminRes] = useRecoilState(adminResAtom);
    const [receptionistRes, setReceptionistRes] = useRecoilState(receptionistResAtom);

    const adminLogin = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}auth/login`,
                data,
            })
            if (res) {
                setLoading(false);
                toast.success(res.message);
                setAuthState({ isAuthenticated: true });
                setAdminRes(res?.user);
                sessionStorage.setItem("token", res?.token);
                sessionStorage.setItem("role", res?.user?.role);
                sessionStorage.setItem("name", res?.user?.name);
                return true;
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    const receptionistLogin = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}/api/receptionist/login`,
                data,
            });
            if (res) {
                setLoading(false);
                setReceptionistRes(res);
                setAuthState({ isAuthenticated: true });
                toast.success(res.message);
                return true;
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    return {
        loading,
        adminLogin,
        receptionistLogin,
        adminRes,
        receptionistRes
    };
}

