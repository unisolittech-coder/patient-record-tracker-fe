import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import useLabHeadManagment from "../../../hooks/lab/labOperator/useLabHeadManagment";

const LabHeadReportView = () => {
  const { uniqueId } = useParams();
  const navigate = useNavigate();
  const { fetchLabHeadReport, loading } = useLabHeadManagment();
  const [reportData, setReportData] = useState(null);
  const [reportApprovalStatus, setReportApprovalStatus] = useState({});

  const breadcrumbPaths = [
    { label: "Lab Head Management" },
    { label: "Lab Report View" },
  ];

  useEffect(() => {
    const loadReport = async () => {
      const res = await fetchLabHeadReport(uniqueId);
      if (res) {
        setReportData(res);
      }
    };

    if (uniqueId) {
      loadReport();
    }
  }, [uniqueId, fetchLabHeadReport]);

  const handleReportApproveReject = (reportIndex, status) => {
    const key = `${reportIndex}`;
    setReportApprovalStatus((prev) => ({
      ...prev,
      [key]: status,
    }));
  };

  const getReportStatusBadge = (reportIndex) => {
    const key = `${reportIndex}`;
    const status = reportApprovalStatus[key];

    if (status === "approved") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Approved
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  const renderObservationsTable = (observations) => {
    if (!observations || observations.length === 0) {
      return (
        <p className="text-gray-500 text-sm py-4">No observations available for this report.</p>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parameter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Result
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit/Ref
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Range
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {observations.map((obs, obsIndex) => (
              <tr key={obsIndex} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {obs.parameter}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {obs.result}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {obs.unitRef}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {obs.range}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title="Lab Report View"
        showSearchBar={false}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : reportData?.reports && reportData.reports.length > 0 ? (
        <div className="space-y-6">
          {reportData.reports.map((report, index) => {
            const reportStatus = reportApprovalStatus[index];

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {report.model || `Report ${index + 1}`}
                      </h3>
                      <p className="text-sm text-blue-100 mt-1">
                        Patient: {report.data?.patientName} | ID: {report.data?.patientId} | Date:{" "}
                        {report.data?.date ? new Date(report.data.date).toLocaleDateString() : "-"}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                      Unique ID: {report.data?.uniqueId}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {renderObservationsTable(report.data?.observations)}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Report Status:</span>
                    {getReportStatusBadge(index)}
                  </div>
                  {!reportStatus && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReportApproveReject(index, "approved")}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReportApproveReject(index, "rejected")}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {reportStatus && (
                    <span className="text-sm text-gray-500">Action taken</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <i className="pi pi-inbox text-5xl text-slate-300 mb-3 block" />
          <p className="text-slate-500 font-medium">No reports found for this unique ID.</p>
        </div>
      )}
    </div>
  );
};

export default LabHeadReportView;
