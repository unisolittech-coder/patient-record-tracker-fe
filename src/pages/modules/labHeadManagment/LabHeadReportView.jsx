import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { createRoot } from "react-dom/client";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import useLabHeadManagment from "../../../hooks/lab/labHeadManagment/useLabHeadManagment";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import LabHeadReportPrintForm from "../../../helper/print/LabHeadReportPrintForm";
import { confirmAlert, confirmRejectAlert } from "../../../utils/alertToast";
import isResultOutOfRange from "../../../utils/isResultOutOfRange";
import ImageModal from "../../../components/common/ImageModal";

const LabHeadReportView = () => {
  const { uniqueId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("date") || "";
  const {
    fetchLabHeadReport,
    fetchPatientTests,
    updatePatientTestStatus,
    updateLabHeadStatus,
    loading,
  } =
    useLabHeadManagment();
  const [reportData, setReportData] = useState(null);
  const [patientTestsState, setPatientTestsState] = useState({
    uhid: uniqueId,
    loading: true,
    groups: [],
  });
  const [updatingTestKeys, setUpdatingTestKeys] = useState({});
  const [reportApprovalStatus, setReportApprovalStatus] = useState({});
  const [expandedReportIndex, setExpandedReportIndex] = useState(null);
  const [showPrintForm, setShowPrintForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const breadcrumbPaths = [
    { label: "Patient Reports Management", url: "/doctor/lab-head" },
    { label: "Lab Report View" },
  ];

  useEffect(() => {
    const loadReport = async () => {
      const res = await fetchLabHeadReport(uniqueId, selectedDate);
      if (res) {
        setReportData(res);
      }
    };

    if (uniqueId) {
      loadReport();
    }
  }, [uniqueId, selectedDate, fetchLabHeadReport]);

  useEffect(() => {
    let isActive = true;
    fetchPatientTests(uniqueId).then(result => {
      if (isActive) {
        setPatientTestsState({
          uhid: uniqueId,
          loading: false,
          groups: result?.tests || [],
        });
      }
    });

    return () => {
      isActive = false;
    };
  }, [uniqueId, fetchPatientTests]);

  const patientTestsLoading = patientTestsState.uhid !== uniqueId || patientTestsState.loading;
  const patientTestGroups = patientTestsState.uhid === uniqueId ? patientTestsState.groups : [];
  const viewedReportDates = new Set(selectedDate
    ? [selectedDate]
    : (reportData?.reports || [])
        .map(report => report.data?.date)
        .filter(Boolean)
  );
  const viewedReportDateLabels = [...viewedReportDates]
    .sort((first, second) => first.localeCompare(second))
    .map(date => new Date(`${date}T00:00:00`).toLocaleDateString());
  const visiblePatientTestGroups = patientTestGroups.filter(group =>
    viewedReportDates.has(group.date)
  );

  const handleReceivedTestChange = async (date, test, isReceived) => {
    const key = `${date}:${test.testName}`;
    setUpdatingTestKeys(current => ({ ...current, [key]: true }));

    const result = await updatePatientTestStatus(uniqueId, date, {
      testName: test.testName,
      status: isReceived ? "test_done" : "pending",
    });

    if (result) {
      setPatientTestsState(current => ({
        ...current,
        groups: current.groups.map(group => group.date !== date
          ? group
          : {
              ...group,
              testNames: group.testNames.map(item => item.testName !== test.testName
                ? item
                : { ...item, status: isReceived ? "test_done" : "pending" }
              ),
            }
        ),
      }));
    }

    setUpdatingTestKeys(current => ({ ...current, [key]: false }));
  };

  console.log(sessionStorage.getItem("signedInUser"));

  /* ------------------------- Print ------------------------- */
  const handlePrint = (report) => {
    setSelectedReport(report);
    setShowPrintForm(true);
    // give the print form time to render + load images (logo / signature)
    setTimeout(() => {
      window.print();
    }, 500);
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setShowPrintForm(false);
      setSelectedReport(null);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  /* -------------------- Image capture (pdf/img) -------------------- */
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

    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );

    const printElement = container.querySelector(".lab-print-form");
    let file = null;
    if (printElement) {
      const canvas = await html2canvas(printElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (blob) {
        file = new File(
          [blob],
          `report-${report.data?.uniqueId || "image"}.png`,
          { type: "image/png" }
        );
      }
    }

    root.unmount();
    document.body.removeChild(container);

    return file;
  };

  /* -------------------- Approve / Reject -------------------- */
  const handleReportApproveReject = async (reportIndex, status) => {
    const key = `${reportIndex}`;
    const report = reportData?.reports?.[reportIndex];

    if (!report) return;

    let alertResult;
    if (status === "approved") {
      alertResult = await confirmAlert(
        "Are you sure you want to approve this report?"
      );
      if (!alertResult.isConfirmed) return;
    } else if (status === "rejected") {
      alertResult = await confirmRejectAlert(
        "Are you sure you want to reject this report?"
      );
      if (!alertResult.isConfirmed) return;
    }

    const formData = new FormData();
    const updatePayload = { model: report.model, status };

    if (status === "rejected" && alertResult.value) {
      updatePayload.rejectedReason = alertResult.value;
    }

    try {
      if (report.model === "LabReport") {
        updatePayload.observationId = (report.data?.observations || [])
          .map((obs) => obs._id)
          .filter(Boolean);
      } else {
        const imageFile = await captureReportAsImage({
          ...report,
          data: {
            ...report.data,
            statusUpdatedAt: new Date().toISOString(),
          },
        });
        if (imageFile) {
          formData.append("images", imageFile);
        }
      }

      formData.append("updates", JSON.stringify([updatePayload]));

      const ReportDate = report.data?.date;
      const result = await updateLabHeadStatus(uniqueId, ReportDate, formData);
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
    const status =
      reportApprovalStatus[key] ||
      reportData?.reports?.[reportIndex]?.data?.status;

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
    if (status === "cancelled") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
          Cancelled
        </span>
      );
    }
    if (status === "for_approval") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          For Approval
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
        <p className="text-gray-500 text-sm py-4">
          No observations available for this report.
        </p>
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
              const isImageUrl =
                isManualType &&
                typeof obs.result === "string" &&
                /^https?:\/\//.test(obs.result);
              const resultIsOutOfRange = !isImageUrl && isResultOutOfRange(
                obs.result,
                obs.range,
                obs.isAbnormal,
                obs.abnormalFlag
              );
              return (
                <tr key={obsIndex} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {obs.parameter}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${resultIsOutOfRange ? "underline decoration-2 underline-offset-2" : ""}`}>
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

      <PagePath title="Lab Report View" showSearchBar={false} />

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Tick which tests are received</h2>
        {viewedReportDateLabels.length > 0 && (
          <p className="mt-1 text-sm text-gray-600">
            Visiting date{viewedReportDateLabels.length > 1 ? "s" : ""}: {viewedReportDateLabels.join(", ")}
          </p>
        )}
        {patientTestsLoading ? (
          <p className="mt-3 text-sm text-gray-500">Loading registered tests...</p>
        ) : visiblePatientTestGroups.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">No registered tests found for this MRID.</p>
        ) : (
          <div className="mt-4 space-y-5">
            {visiblePatientTestGroups.map(group => (
              <div key={group.date} className="border-t border-gray-100 pt-4 first:border-0 first:pt-0">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  {group.date ? new Date(`${group.date}T00:00:00`).toLocaleDateString() : "Undated"}
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {group.testNames.map(test => {
                    const key = `${group.date}:${test.testName}`;
                    const isReceived = test.status === "test_done";

                    return (
                      <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-blue-600"
                          checked={isReceived}
                          disabled={patientTestsLoading || Boolean(updatingTestKeys[key])}
                          onChange={event => handleReceivedTestChange(group.date, test, event.target.checked)}
                        />
                        <span className="min-w-0 flex-1 text-sm font-medium text-gray-800">{test.testName}</span>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${isReceived ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                          {isReceived ? "Received" : "Pending"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : reportData?.reports && reportData.reports.length > 0 ? (
        <div className="space-y-6">
          {reportData.reports.map((report, index) => {
            const isExpanded = expandedReportIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExpandedReportIndex(isExpanded ? null : index)}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Hide" : "Open"} ${report.reportType || `Report ${index + 1}`}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                    >
                      <i className={`pi ${isExpanded ? "pi-chevron-down" : "pi-chevron-right"}`} />
                    </button>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {report.reportType || `Report ${index + 1}`}
                      </h3>
                      <p className="text-sm text-blue-100 mt-1">
                        Patient: {report.data?.patientName} | Age:{" "}
                        {report.data?.age ?? "N/A"} | Gender:{" "}
                        {report.data?.gender || "N/A"} | MRID:{" "}
                        {report.data?.UHID} | Date:{" "}
                        {report.data?.date
                          ? new Date(report.data.date).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <>
                    <div className="p-6">
                      {renderObservationsTable(
                        report.data?.observations,
                        report.reportType
                      )}
                      {report.data?.cancellationRemark && (
                        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                          <p className="text-sm font-semibold text-amber-900">Cancellation remark</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-amber-800">
                            {report.data.cancellationRemark}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          Report Status:
                        </span>
                        {getReportStatusBadge(index)}
                      </div>
                      {(reportApprovalStatus[index] || report.data?.status) ===
                        "for_approval" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePrint(report)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleReportApproveReject(index, "approved")
                            }
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleReportApproveReject(index, "rejected")
                            }
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <i className="pi pi-inbox text-5xl text-slate-300 mb-3 block" />
          <p className="text-slate-500 font-medium">
            No reports found for this MRID.
          </p>
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

      {/* ======================= PRINT STYLES ======================= */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide everything except the print form */
          body * {
            visibility: hidden !important;
          }
          .lab-print-form,
          .lab-print-form * {
            visibility: visible !important;
          }

          /* Pull the print form out of the layout so its own pagination works */
          .lab-print-form {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LabHeadReportView;