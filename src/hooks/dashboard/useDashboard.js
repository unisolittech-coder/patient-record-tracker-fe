import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { dashboardStatsDataAtom } from "../../state/dashboard/dashboardState";

const useDashboard = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [dashboardStatsData, setDashboardStatsData] = useRecoilState(dashboardStatsDataAtom);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}dashboard/stats`,
            });
            if (res) {
                setLoading(false);
                setDashboardStatsData(res?.data);
                return true;
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            setLoading(false);
            return false;
        }
    };

    return {
        loading,
        dashboardStatsData,
        fetchDashboardStats
    };
};

export default useDashboard;