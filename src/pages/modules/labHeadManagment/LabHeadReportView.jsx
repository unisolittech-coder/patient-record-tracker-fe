import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createRoot } from "react-dom/client";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import useLabHeadManagment from "../../../hooks/lab/labHeadManagment/useLabHeadManagment";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import LabHeadReportPrintForm from "../../../helper/print/LabHeadReportPrintForm";
import { confirmAlert, confirmRejectAlert } from "../../../utils/alertToast";
import ImageModal from "../../../components/common/ImageModal";

const LabHeadReportView = () => {
  const { uniqueId } = useParams();
  const { fetchLabHeadReport, updateLabHeadStatus, loading } = useLabHeadManagment();
  const [reportData, setReportData] = useState(null);
  const [reportApprovalStatus, setReportApprovalStatus] = useState({});
  const [showPrintForm, setShowPrintForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const breadcrumbPaths = [
    { label: "Lab Head Management", url:'/doctor/lab-head' },
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

  const handlePrint = (report) => {
    setSelectedReport(report);
    setShowPrintForm(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setShowPrintForm(false);
      setSelectedReport(null);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  const captureReportAsImage = async (report) => {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.zIndex = "-1";
    container.style.background = "#ffffff";
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<LabHeadReportPrintForm report={report} />);

    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const printElement = container.querySelector(".lab-print-form");
    let file = null;
    if (printElement) {
      const canvas = await html2canvas(printElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (blob) {
        file = new File([blob], `report-${report.data?.uniqueId || "image"}.png`, { type: "image/png" });
      }
    }

    root.unmount();
    document.body.removeChild(container);

    return file;
  };

  const fetchImageAsFile = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename || `report-image-${Date.now()}.png`, { type: blob.type || "image/png" });
  };

  const handleReportApproveReject = async (reportIndex, status) => {
    const key = `${reportIndex}`;
    const report = reportData?.reports?.[reportIndex];

    if (!report) return;

    let alertResult;
    if (status === "approved") {
      alertResult = await confirmAlert("Are you sure you want to approve this report?");
      if (!alertResult.isConfirmed) return;
    } else if (status === "rejected") {
      alertResult = await confirmRejectAlert("Are you sure you want to reject this report?");
      if (!alertResult.isConfirmed) return;
    }

    const formData = new FormData();
    const updatePayload = { model: report.model, status };

    if (status === "rejected" && alertResult.value) {
      updatePayload.rejectedReason = alertResult.value;
    }

    formData.append("updates", JSON.stringify([updatePayload]));

    try {
      if (report.reportType === "Manual Type") {
        const imageUrls = (report.data?.observations || [])
          .filter((obs) => typeof obs.result === "string" && /^https?:\/\//.test(obs.result))
          .map((obs) => obs.result);

        for (const url of imageUrls) {
          try {
            const imageFile = await fetchImageAsFile(url, `manual-report-${Date.now()}-${Math.random().toString(36).slice(2)}.png`);
            formData.append("images", imageFile);
          } catch (err) {
            console.error("Failed to fetch manual report image:", url, err);
          }
        }
      } else {
        const imageFile = await captureReportAsImage(report);
        if (imageFile) {
          formData.append("images", imageFile);
        }
      }

      const result = await updateLabHeadStatus(uniqueId, formData);
      if (result) {
        setReportApprovalStatus((prev) => ({
          ...prev,
          [key]: status,
        }));
        // toast.success(result.message || `Report ${status} successfully`);
      }
    } catch (error) {
      console.error("Error updating report status:", error);
      toast.error(error.message || "Failed to update report status");
    }
  };

  const getReportStatusBadge = (reportIndex) => {
    const key = `${reportIndex}`;
    const status = reportApprovalStatus[key] || reportData?.reports?.[reportIndex]?.data?.status;

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

  const renderObservationsTable = (observations, reportType) => {
    if (!observations || observations.length === 0) {
      return (
        <p className="text-gray-500 text-sm py-4">No observations available for this report.</p>
      );
    }

    const isManualType = reportType === "Manual Type";

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
            {observations.map((obs, obsIndex) => {
              const isImageUrl = isManualType && typeof obs.result === "string" && /^https?:\/\//.test(obs.result);
              return (
                <tr key={obsIndex} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {obs.parameter}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {isImageUrl ? (
                      <div
                        className="relative inline-block cursor-pointer group"
                        onClick={() => setPreviewImage(obs.result)}
                      >
                        <img
                          src={obs.result}
                          alt={obs.parameter}
                          className="max-w-[200px] max-h-[200px] object-contain border border-gray-200 rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg">
                          <i className="pi pi-search-plus text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"></i>
                        </div>
                      </div>
                    ) : (
                      obs.result
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {obs.unitRef}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {obs.range}
                  </td>
                </tr>
              );
            })}
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
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {report.reportType || `Report ${index + 1}`}
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
                  {renderObservationsTable(report.data?.observations, report.reportType)}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Report Status:</span>
                    {getReportStatusBadge(index)}
                  </div>
                  {(reportApprovalStatus[index] || report.data?.status) === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrint(report)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        View
                      </button>
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
      {showPrintForm && <LabHeadReportPrintForm report={selectedReport} />}
      {previewImage && (
        <ImageModal
          src={previewImage}
          alt="Report Image Preview"
          onClose={() => setPreviewImage(null)}
        />
      )}

      {/* Print Styles */}
      <style>{`
          @media print {
              @page {
                  margin: 0;
                  size: auto;
              }
              body * {
                  visibility: hidden;
              }
              .lab-print-form, .lab-print-form * {
                  visibility: visible;
              }
              .lab-print-form {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
              }
          }
      `}</style>
    </div>
  );
};

export default LabHeadReportView;
