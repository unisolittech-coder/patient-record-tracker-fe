import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { dashboardStatsDataAtom, genderDistributionDataAtom, registrationChartDataAtom } from "../../state/dashboard/dashboardState";

const useDashboard = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [dashboardStatsData, setDashboardStatsData] = useRecoilState(dashboardStatsDataAtom);
    const [registrationChartData, setRegistrationChartData] = useRecoilState(registrationChartDataAtom);
    const [genderDistributionData, setGenderDistributionData] = useRecoilState(genderDistributionDataAtom);

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

    const fetchRegistrationChartData = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}dashboard/registrations-chart`,
            });
            if (res) {
                setLoading(false);
                setRegistrationChartData(res?.data);
                return true;
            }
        } catch (error) {
            console.error("Error fetching registration chart data:", error);
            setLoading(false);
            return false;
        }
    };

    const fetchGenderDistributionData = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}dashboard/gender-distribution`,
            });
            if (res) {
                setLoading(false);
                setGenderDistributionData(res?.data);
                return true;
            }
        } catch (error) {
            console.error("Error fetching gender distribution data:", error);
            setLoading(false);
            return false;
        }
    };

    return {
        loading,
        dashboardStatsData,
        fetchDashboardStats,
        registrationChartData,
        fetchRegistrationChartData,
        genderDistributionData,
        fetchGenderDistributionData
    };
};

export default useDashboard;