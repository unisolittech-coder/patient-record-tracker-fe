import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import Button from "../../../components/common/Button";
import ImageModal from "../../../components/common/ImageModal";
import useLabOperatorManagment from "../../../hooks/lab/labOperatorManagment/useLabOperatorManagment";

export default function LabOperatorRejectedReportView() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { loading, fetchLabRejectedReport, updateLabRejectedReport } = useLabOperatorManagment();
    const [reportData, setReportData] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const model = searchParams.get("model") || "";
    const testName = searchParams.get("testName") || "";
    const uhid = searchParams.get("uhid") || "";
    const date = searchParams.get("date") || "";

    const breadcrumbPaths = [
        { label: "Lab Operator Management", url: "/doctor/lab-operator" },
        { label: "Rejected Reports", url: "/doctor/lab-operator/rejected-reports" },
        { label: "Report View" },
    ];

    useEffect(() => {
        const loadReport = async () => {
            if (model && testName && uhid && date) {
                const res = await fetchLabRejectedReport({ model, testName, uhid , date});
                if (res) {
                    setReportData(res);
                }
            }
        };
        loadReport();
    }, [model, testName, uhid, date, fetchLabRejectedReport]);

    const getReportStatusBadge = (status) => {
        if (status === "approved") {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <i className="pi pi-check-circle-fill text-green-500 text-xs"></i>
                    Approved
                </span>
            );
        }
        if (status === "rejected") {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <i className="pi pi-times-circle-fill text-red-500 text-xs"></i>
                    Rejected
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <i className="pi pi-clock-fill text-yellow-500 text-xs"></i>
                {status || "Pending"}
            </span>
        );
    };

    const RejectionReasonBanner = ({ reason }) => {
        if (!reason) return null;
        return (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-3">
                    <i className="pi pi-exclamation-triangle text-red-500 text-2xl flex-shrink-0 mt-0.5"></i>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-900 uppercase tracking-wide mb-1.5">
                            Rejection Reason
                        </p>
                        <p className="text-gray-800 text-sm leading-relaxed">{reason}</p>
                    </div>
                </div>
            </div>
        );
    };

    const RejectionReasonInline = ({ reason }) => {
        if (!reason) return null;
        return (
            <div className="mt-3 pl-2 border-l-2 border-red-200">
                <div className="flex items-start gap-2">
                    <i className="pi pi-info-circle text-red-400 text-sm flex-shrink-0 mt-0.5"></i>
                    <div>
                        <p className="text-xs font-semibold text-red-800 uppercase tracking-wide">
                            Rejection Reason
                        </p>
                        <p className="text-xs text-red-700 mt-0.5">{reason}</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderImages = (images) => {
        if (!images || images.length === 0) return null;

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => setPreviewImage(img)}
                    >
                        <img
                            src={img}
                            alt={`Report image ${index + 1}`}
                            className="w-full h-48 object-contain border border-gray-200 rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:shadow-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl">
                            <i className="pi pi-search-plus text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"></i>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderObservations = (observations, reportType) => {
        if (!observations || observations.length === 0) {
            return (
                <p className="text-gray-500 text-sm py-4">
                    No observations available for this report.
                </p>
            );
        }

        const isManualType = reportType === "Manual Type";

        return (
            <div className="space-y-4">
                {observations.map((obs, obsIndex) => {
                    const isImageUrl =
                        isManualType &&
                        typeof obs.result === "string" &&
                        /^https?:\/\//.test(obs.result);

                    return (
                        <div
                            key={obsIndex}
                            className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            {isImageUrl && obs.result ? (
                                <div
                                    className="relative flex-shrink-0 cursor-pointer group"
                                    onClick={() => setPreviewImage(obs.result)}
                                >
                                    <img
                                        src={obs.result}
                                        alt={obs.parameter}
                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm transition-transform duration-200 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg">
                                        <i className="pi pi-search-plus text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"></i>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg">
                                    <i className="pi pi-file text-4xl text-gray-300"></i>
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {obs.parameter || "-"}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {obs.unitRef || obs.range
                                                ? `${obs.unitRef || ""} ${obs.unitRef && obs.range ? "| " : ""}${obs.range ? "Range: " + obs.range : ""}`.trim()
                                                : "-"}
                                        </p>
                                    </div>
                                    {getReportStatusBadge(obs.status)}
                                </div>

                                {isImageUrl && obs.result && (
                                    <p className="text-xs text-gray-500 mb-2">
                                        Report file attached
                                    </p>
                                )}

                                <RejectionReasonInline reason={obs.rejectedReason} />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const reports = reportData?.reports || (reportData?.report ? [reportData?.report] : []) || [];

    const handleUpdate = async (report) => {
        const data = report.data || {};

        const fileResult = await Swal.fire({
            title: "Update Rejected Report",
            html: `
                <p class="text-sm text-gray-600 mb-3">
                    Attach new report file(s) to re-submit this rejected report.
                </p>
                <input
                    type="file"
                    id="reportFilesInput"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    class="w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer"
                />
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#9ca3af",
            confirmButtonText: "Update Report",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                const input = document.getElementById("reportFilesInput");
                if (!input || !input.files || input.files.length === 0) {
                    Swal.showValidationMessage("Please select at least one file");
                    return null;
                }
                return Array.from(input.files);
            },
        });

        if (fileResult.isConfirmed && fileResult.value && fileResult.value.length > 0) {
            const result = await updateLabRejectedReport(
                { model: report.model, testName: data.testName || testName, uhid: data.UHID || uhid , date: data.date || date },
                fileResult.value
            );

            if (result) {
                Swal.fire({
                    title: "Success!",
                    text: "Report updated successfully.",
                    icon: "success",
                    confirmButtonColor: "#2563eb",
                    timer: 1500,
                }).then(() => {
                    navigate("/doctor/lab-operator/rejected-reports");
                });
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <BreadCrumb paths={breadcrumbPaths} />

            <PagePath
                title="Rejected Report View"
                showSearchBar={false}
            >
                <Button
                    label="Back to Rejected Reports"
                    icon="pi pi-arrow-left"
                    variant="secondary"
                    onClick={() => navigate("/doctor/lab-operator/rejected-reports")}
                />
            </PagePath>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : reports.length > 0 ? (
                <div className="space-y-8">
                    {reports.map((report, index) => {
                        const data = report.data || {};
                        const patientName = data.employeeName || data.patientName || "N/A";
                        const hasObservations = (data.observations || []).length > 0;
                        const hasImages = (data.images || []).length > 0;

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="px-6 py-5 bg-gradient-to-r from-red-600/90 to-pink-600/90 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold flex items-center gap-2">
                                                <i className="pi pi-file-o text-xl"></i>
                                                {report.reportType || `Report ${index + 1}`}
                                            </h3>
                                            <p className="text-sm text-red-100 mt-1">
                                                Patient: {patientName} | UHID: {data.UHID || "-"} | Date:{" "}
                                                {data.date ? new Date(data.date).toLocaleDateString() : "-"}
                                            </p>
                                        </div>
                                         <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                                                Model: {report.model || "-"}
                                            </span>
                                            {getReportStatusBadge(data.status)}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                Patient Name
                                            </p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {patientName}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                UHID
                                            </p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {data.UHID || "N/A"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                Test Name
                                            </p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {data.testName || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {hasObservations ? (
                                        renderObservations(data.observations, report.reportType)
                                    ) : hasImages ? (
                                        <>
                                            <RejectionReasonBanner reason={data.rejectedReason} />
                                            {renderImages(data.images)}
                                        </>
                                    ) : (
                                        <>
                                            <RejectionReasonBanner reason={data.rejectedReason} />
                                            {renderObservations(data.observations, report.reportType)}
                                        </>
                                    )}

                                    {data.status === "rejected" && report.model === "LabReport" && (
                                        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                                            <button
                                                onClick={() => handleUpdate(report)}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={loading}
                                            >
                                                <i className="pi pi-upload"></i>
                                                Update Report
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
                    <p className="text-slate-500 font-medium">
                        No reports found for the selected parameters.
                    </p>
                </div>
            )}

            {previewImage && (
                <ImageModal
                    src={previewImage}
                    alt="Report Image Preview"
                    onClose={() => setPreviewImage(null)}
                />
            )}
        </div>
    );
}
