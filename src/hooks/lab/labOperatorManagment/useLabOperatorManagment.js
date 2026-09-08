import { useCallback } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../../hooks/useFetch";
import { toast } from "react-toastify";
import {
    labOperatorLoadingAtom,
    labOperatorErrorAtom,
    labOperatorFormAtom,
    labPatientSearchAtom,
    labRejectedReportsAtom,
    labRejectedReportAtom,
    labRejectedReportUpdateAtom,
    labAllReportsLoadingAtom,
    labAllReportsErrorAtom,
    labAllReportsAtom,
    labReportDetailsLoadingAtom,
    labReportDetailsErrorAtom,
    labReportDetailsAtom
} from "../../../state/lab/labOperatorState";

const useLabOperatorManagment = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useRecoilState(labOperatorLoadingAtom);
    const [error, setError] = useRecoilState(labOperatorErrorAtom);
    const [formData, setFormData] = useRecoilState(labOperatorFormAtom);
    const [labPatientSearch, setLabPatientSearch] = useRecoilState(labPatientSearchAtom);
    const [labRejectedReports, setLabRejectedReports] = useRecoilState(labRejectedReportsAtom);
    const [labRejectedReport, setLabRejectedReport] = useRecoilState(labRejectedReportAtom);
    const [labRejectedReportUpdate, setLabRejectedReportUpdate] = useRecoilState(labRejectedReportUpdateAtom);
    const [labAllReportsLoading, setLabAllReportsLoading] = useRecoilState(labAllReportsLoadingAtom);
    const [labAllReportsError, setLabAllReportsError] = useRecoilState(labAllReportsErrorAtom);
    const [labAllReports, setLabAllReports] = useRecoilState(labAllReportsAtom);
    const [labReportDetailsLoading, setLabReportDetailsLoading] = useRecoilState(labReportDetailsLoadingAtom);
    const [labReportDetailsError, setLabReportDetailsError] = useRecoilState(labReportDetailsErrorAtom);
    const [labReportDetails, setLabReportDetails] = useRecoilState(labReportDetailsAtom);

    const submitLabReports = useCallback(async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}lab-operators`,
                data: payload,
            });

            if (res) {
                setLoading(false);
                toast.success(res.message || "Lab reports submitted successfully");
                return res;
            }
        } catch (error) {
            console.error("Error submitting lab reports:", error);
            setLoading(false);
            setError(error.message || "Failed to submit lab reports");
            toast.error(error.response?.data?.message || "Failed to submit lab reports");
            return false;
        }
    }, [fetchData, setLoading, setError]);

    const resetForm = useCallback(() => {
        setFormData({
            uniqueId: "",
            tests: [{ testName: "", report: null }]
        });
        setError(null);
    }, [setFormData, setError]);

    const fetchLabPatientSearch = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}lab-operators/patient/${id}`,
            });
            if (res) {
                setLabPatientSearch(res.patient);
                setLoading(false);
                return true;
            }
            setLoading(false);
            return false;
        } catch (error) {
            console.error("Error fetching lab patient search:", error);
            toast.error(error.response?.data?.message);
            setLoading(false);
             setLabPatientSearch(null);
             return false;
         }
     }

     const fetchLabRejectedReports = useCallback(async () => {
         setLoading(true);
         setError(null);

         try {
             const res = await fetchData({
                 method: "GET",
                 url: `${conf.apiBaseUrl}lab-operators/rejected-reports`,
             });

             if (res) {
                 setLabRejectedReports(res.reports || []);
                 setLoading(false);
                 return res;
             }
             setLoading(false);
             return false;
         } catch (error) {
             console.error("Error fetching rejected reports:", error);
             setLoading(false);
             setError(error.message || "Failed to fetch rejected reports");
             toast.error(error.response?.data?.message || "Failed to fetch rejected reports");
             setLabRejectedReports(null);
             return false;
         }
      }, [fetchData, setLoading, setError, setLabRejectedReports]);

      const fetchLabRejectedReport = useCallback(async (params) => {
          setLoading(true);
          setError(null);

          try {
              const res = await fetchData({
                  method: "GET",
                  url: `${conf.apiBaseUrl}lab-operators/rejected-report`,
                  params,
              });

              if (res) {
                  const reportsArray = res.reports || (res.report ? [res.report] : []);
                  setLabRejectedReport({ ...res, reports: reportsArray });
                  setLoading(false);
                  return res;
              }
              setLoading(false);
              return false;
          } catch (error) {
              console.error("Error fetching rejected report:", error);
              setLoading(false);
              setError(error.message || "Failed to fetch rejected report");
              toast.error(error.response?.data?.message || "Failed to fetch rejected report");
              setLabRejectedReport(null);
              return false;
          }
      }, [fetchData, setLoading, setError, setLabRejectedReport]);

      const updateLabRejectedReport = useCallback(async (params, files) => {
          setLoading(true);
          setError(null);

          try {
              const formData = new FormData();
              formData.append("model", params.model);
              formData.append("testName", params.testName);
              formData.append("uhid", params.uhid);

              const filesArray = Array.isArray(files) ? files : Array.from(files || []);
              filesArray.forEach((file) => {
                  formData.append("reports", file);
              });

              const res = await fetchData({
                  method: "PUT",
                  url: `${conf.apiBaseUrl}lab-operators/rejected-reports`,
                  data: formData,
              });

              if (res) {
                  setLabRejectedReportUpdate(res);
                  setLoading(false);
                  toast.success(res.message || "Rejected report updated successfully");
                  return res;
              }
              setLoading(false);
              return false;
          } catch (error) {
              console.error("Error updating rejected report:", error);
              setLoading(false);
              setError(error.message || "Failed to update rejected report");
              toast.error(error.response?.data?.message || "Failed to update rejected report");
              setLabRejectedReportUpdate(null);
              return false;
          }
      }, [fetchData, setLoading, setError, setLabRejectedReportUpdate]);

      const fetchLabAllReports = useCallback(async () => {
          setLabAllReportsLoading(true);
          setLabAllReportsError(null);

          try {
              const res = await fetchData({
                  method: "GET",
                  url: `${conf.apiBaseUrl}lab-operators/all-reports`,
              });

              if (res) {
                  setLabAllReports(res.reports || []);
                  setLabAllReportsLoading(false);
                  return res;
              }
              setLabAllReportsLoading(false);
              return false;
          } catch (error) {
              console.error("Error fetching all lab reports:", error);
              setLabAllReportsLoading(false);
              setLabAllReportsError(error.message || "Failed to fetch all lab reports");
              toast.error(error.response?.data?.message || "Failed to fetch all lab reports");
              setLabAllReports(null);
              return false;
          }
       }, [fetchData, setLabAllReportsLoading, setLabAllReportsError, setLabAllReports]);

       const fetchLabReportDetails = useCallback(async (params) => {
           setLabReportDetailsLoading(true);
           setLabReportDetailsError(null);

           try {
               const res = await fetchData({
                   method: "GET",
                   url: `${conf.apiBaseUrl}lab-operators/report-details`,
                   params,
               });

               if (res) {
                   setLabReportDetails(res.report || res);
                   setLabReportDetailsLoading(false);
                   return res;
               }
               setLabReportDetailsLoading(false);
               return false;
           } catch (error) {
               console.error("Error fetching lab report details:", error);
               setLabReportDetailsLoading(false);
               setLabReportDetailsError(error.message || "Failed to fetch lab report details");
               toast.error(error.response?.data?.message || "Failed to fetch lab report details");
               setLabReportDetails(null);
               return false;
           }
       }, [fetchData, setLabReportDetailsLoading, setLabReportDetailsError, setLabReportDetails]);

       return {
         loading,
         error,
         formData,
         setFormData,
         submitLabReports,
         resetForm,
         fetchLabPatientSearch,
         labPatientSearch,
         labRejectedReports,
         fetchLabRejectedReports,
         labRejectedReport,
         fetchLabRejectedReport,
         labRejectedReportUpdate,
         updateLabRejectedReport,
          labAllReports,
          fetchLabAllReports,
          labAllReportsLoading,
          labAllReportsError,
          labReportDetails,
          fetchLabReportDetails,
          labReportDetailsLoading,
          labReportDetailsError
      };
};

export default useLabOperatorManagment;
