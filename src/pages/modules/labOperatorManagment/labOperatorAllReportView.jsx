import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import Button from "../../../components/common/Button";
import ImageModal from "../../../components/common/ImageModal";
import useLabOperatorManagment from "../../../hooks/lab/labOperatorManagment/useLabOperatorManagment";

export default function LabOperatorAllReportView() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { fetchLabReportDetails, labReportDetailsLoading, labReportDetailsError } = useLabOperatorManagment();
    const [reportData, setReportData] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const model = searchParams.get("model") || "";
    const testName = searchParams.get("testName") || "";
    const uhid = searchParams.get("uhid") || "";

    const breadcrumbPaths = [
        { label: "Lab Operator Management", url: "/doctor/lab-operator" },
        { label: "All Reports", url: "/doctor/lab-operator/all-reports" },
        { label: "Report View" },
    ];

    useEffect(() => {
        const loadReport = async () => {
            if (!model || !testName || !uhid) return;
            const res = await fetchLabReportDetails({ model, testName, uhid });
            if (res) {
                setReportData(res.report || res);
            }
        };
        loadReport();
    }, [model, testName, uhid, fetchLabReportDetails]);

    const getReportStatusBadge = (status) => {
        const statusClasses = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}>
                {status === "approved" && <i className="pi pi-check-circle-fill text-green-500 text-xs"></i>}
                {status === "rejected" && <i className="pi pi-times-circle-fill text-red-500 text-xs"></i>}
                {status === "pending" && <i className="pi pi-clock-fill text-yellow-500 text-xs"></i>}
                {status || "Pending"}
            </span>
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

    const renderObservationsTable = (observations, reportType) => {
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {observations.map((obs, obsIndex) => {
                            const isImageUrl = reportType === "Manual Type" && typeof obs.value === "string" && /^https?:\/\//.test(obs.value);
                            return (
                                <tr key={obsIndex} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {obs.testName || obs.observationIdentifier || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {isImageUrl ? (
                                            <div
                                                className="relative inline-block cursor-pointer group"
                                                onClick={() => setPreviewImage(obs.value)}
                                            >
                                                <img
                                                    src={obs.value}
                                                    alt={obs.testName}
                                                    className="max-w-[200px] max-h-[200px] object-contain border border-gray-200 rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg">
                                                    <i className="pi pi-search-plus text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"></i>
                                                </div>
                                            </div>
                                        ) : (
                                            obs.value || "-"
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {obs.units || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {obs.referenceRange || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {obs.abnormalFlag && obs.abnormalFlag !== "N" ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {obs.resultStatusLabel || "Abnormal"}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {obs.resultStatusLabel || "Normal"}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const report = reportData?.data || reportData;
    const observations = report?.observations || [];
    const images = report?.images || [];

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <BreadCrumb paths={breadcrumbPaths} />

            <PagePath
                title="All Reports View"
                showSearchBar={false}
            >
                <Button
                    label="Back to All Reports"
                    icon="pi pi-arrow-left"
                    variant="secondary"
                    onClick={() => navigate("/doctor/lab-operator/all-reports")}
                />
                <Button
                    label="Refresh"
                    icon="pi pi-refresh"
                    variant="secondary"
                    onClick={() => fetchLabReportDetails({ model, testName, uhid })}
                    disabled={labReportDetailsLoading}
                />
            </PagePath>

            {labReportDetailsError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3 text-red-700">
                        <i className="pi pi-exclamation-circle text-xl"></i>
                        <p className="text-sm">{labReportDetailsError}</p>
                    </div>
                </div>
            )}

            {labReportDetailsLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : !report ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                    <i className="pi pi-inbox text-5xl text-slate-300 mb-3 block" />
                    <p className="text-slate-500 font-medium">No report found for the selected parameters.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <i className="pi pi-file-o text-xl"></i>
                                        {report.reportType || "Report"}
                                    </h3>
                                    <p className="text-sm text-blue-100 mt-1">
                                        Patient: {report.patientName || "N/A"} | UHID: {report.UHID || "-"} | Date:{" "}
                                        {report.date ? new Date(report.date).toLocaleDateString() : "-"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                                        Model: {report.model || "-"}
                                    </span>
                                    {getReportStatusBadge(report.status)}
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
                                        {report.patientName || "N/A"}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                        UHID
                                    </p>
                                    <p className="text-sm font-medium text-gray-800">
                                        {report.UHID || "N/A"}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                        Test Name
                                    </p>
                                    <p className="text-sm font-medium text-gray-800">
                                        {report.testName || "-"}
                                    </p>
                                </div>
                            </div>

                            <h4 className="text-base font-semibold text-gray-800 mb-4">Observations</h4>
                            {renderObservationsTable(observations, report.reportType)}

                            {images.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-base font-semibold text-gray-800 mb-3">Report Images</h4>
                                    {renderImages(images)}
                                </div>
                            )}

                            {report.rejectedReason && (
                                <div className="mt-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <i className="pi pi-exclamation-triangle text-red-500 text-2xl flex-shrink-0 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-red-900 uppercase tracking-wide mb-1.5">
                                                Rejection Reason
                                            </p>
                                            <p className="text-gray-800 text-sm leading-relaxed">{report.rejectedReason}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
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
