import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config/index";
import useFetch from "../useFetch";
import { analyticsLogsAtom, analyticsReportDownloadAtom, analyticsReportUploadAtom } from "../../state/dashboard/dashboardState";

const useAnalytics = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [analyticsLogs, setAnalyticsLogs] = useRecoilState(analyticsLogsAtom);
    const [analyticsReportUpload, setAnalyticsReportUpload] = useRecoilState(analyticsReportUploadAtom);
    const [analyticsReportDownload, setAnalyticsReportDownload] = useRecoilState(analyticsReportDownloadAtom)

    const fetchLogs = async (page, limit, startDate, endDate, action) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            if (action) params.append("action", action)
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}analytics/logs?${params}`,
            });
            if (res) {
                setLoading(false);
                setAnalyticsLogs(res?.data)
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            setLoading(false);
            return false;
        }
    };

    const fetchReportUpload = async (page, limit, startDate, endDate) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}analytics/reports/upload?${params}`,
            });
            if (res) {
                setLoading(false);
                setAnalyticsReportUpload(res?.data)
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            setLoading(false);
            return false;
        }
    };

    const fetchReportDownload = async (page, limit, startDate, endDate) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}analytics/reports/download?${params}`,
            });
            if (res) {
                setLoading(false);
                setAnalyticsReportDownload(res?.data)
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            setLoading(false);
            return false;
        }
    };

    return {loading, fetchLogs, analyticsLogs, analyticsReportUpload, fetchReportUpload,
        fetchReportDownload, analyticsReportDownload}
}

export default useAnalytics