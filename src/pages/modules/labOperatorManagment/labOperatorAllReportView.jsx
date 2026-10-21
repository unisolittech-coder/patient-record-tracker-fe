import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BreadCrumb from "../../../components/common/BreadCrumb";
import Button from "../../../components/common/Button";
import ImageModal from "../../../components/common/ImageModal";
import PagePath from "../../../components/common/PagePath";
import useLabOperatorManagment from "../../../hooks/lab/labOperatorManagment/useLabOperatorManagment";

export default function LabOperatorAllReportView() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {
        fetchLabReportsForPatient,
        fetchLabReportDetails,
        sendReportsForApproval,
        cancelLabOperatorReport,
        fetchIggmcPatientDetails,
        labReportDetailsError,
    } = useLabOperatorManagment();
    const uhid = searchParams.get("uhid") || "";
    const date = searchParams.get("date") || "";
    const [reports, setReports] = useState([]);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(Boolean(uhid));
    const [expandedReport, setExpandedReport] = useState(null);
    const [reportDetails, setReportDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});
    const [sendingAllForApproval, setSendingAllForApproval] = useState(false);
    const [cancellingReports, setCancellingReports] = useState({});
    const [cancellationTarget, setCancellationTarget] = useState(null);
    const [cancellationRemark, setCancellationRemark] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

    const fetchPatientData = useCallback(async () => {
        if (!uhid) return [[], null];
        return Promise.all([
            fetchLabReportsForPatient(uhid, date),
            fetchIggmcPatientDetails(uhid),
        ]);
    }, [date, fetchIggmcPatientDetails, fetchLabReportsForPatient, uhid]);

    const loadReports = useCallback(async () => {
        setLoading(true);
        const [patientReports, patientDetails] = await fetchPatientData();
        setReports(Array.isArray(patientReports) ? patientReports : []);
        setPatient(patientDetails);
        setLoading(false);
    }, [fetchPatientData]);

    useEffect(() => {
        let active = true;
        const load = async () => {
            const [patientReports, patientDetails] = await fetchPatientData();
            if (!active) return;
            setReports(Array.isArray(patientReports) ? patientReports : []);
            setPatient(patientDetails);
            setLoading(false);
        };
        load();
        return () => {
            active = false;
        };
    }, [date, fetchPatientData]);

    const getReportKey = report => [
        report.model,
        report.data?.uniqueId || "",
        report.data?.testName || "",
    ].join(":");

    const toggleReport = async report => {
        const key = getReportKey(report);
        if (expandedReport === key) {
            setExpandedReport(null);
            return;
        }

        setExpandedReport(key);
        if (reportDetails[key]) return;

        setLoadingDetails(current => ({ ...current, [key]: true }));
        const result = await fetchLabReportDetails({
            model: report.model,
            uhid,
            date: report.data?.date || date,
        });
        const detailReport = result?.report || result?.reports?.[0] || result;
        setReportDetails(current => ({ ...current, [key]: detailReport || null }));
        setLoadingDetails(current => ({ ...current, [key]: false }));
    };

    const getReportPayload = report => ({
        model: report.model,
        testName: report.data?.testName || report.testName || report.reportType || report.model,
        uhid,
        date: report.data?.date || date,
    });

    const updateReportStatus = (key, status, extraData = {}) => {
        setReports(current => current.map(item => (
            getReportKey(item) === key
                ? { ...item, data: { ...item.data, status, ...extraData } }
                : item
        )));
    };

    const handleSendAllForApproval = async () => {
        const pendingReports = reports.filter(report => (report.data?.status || "pending") === "pending");
        if (!pendingReports.length) return;

        setSendingAllForApproval(true);
        try {
            const result = await sendReportsForApproval(pendingReports.map(getReportPayload));
            if (result) {
                const sentReports = new Set((result.sent || []).map(item => [
                    item.model,
                    item.testName,
                    item.date,
                ].join(":")));
                setReports(current => current.map(item => {
                    const payload = getReportPayload(item);
                    const identity = [payload.model, payload.testName, payload.date].join(":");
                    return sentReports.has(identity)
                        ? { ...item, data: { ...item.data, status: "for_approval" } }
                        : item;
                }));
            }
        } finally {
            setSendingAllForApproval(false);
        }
    };

    const handleCancelReport = async () => {
        const remark = cancellationRemark.trim();
        if (!remark || !cancellationTarget) return;
        const { report, key } = cancellationTarget;
        setCancellingReports(current => ({ ...current, [key]: true }));
        try {
            const result = await cancelLabOperatorReport({
                ...getReportPayload(report),
                cancellationRemark: remark,
            });
            if (result) {
                updateReportStatus(key, "cancelled", { cancellationRemark: remark });
                setCancellationTarget(null);
                setCancellationRemark("");
            }
        } finally {
            setCancellingReports(current => ({ ...current, [key]: false }));
        }
    };

    const getStatusClasses = status => ({
        pending: "bg-yellow-100 text-yellow-800",
        for_approval: "bg-blue-100 text-blue-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        cancelled: "bg-gray-200 text-gray-700",
    }[status] || "bg-gray-100 text-gray-700");

    const renderExpandedReport = (report, key) => {
        if (loadingDetails[key]) {
            return <p className="py-6 text-center text-sm text-gray-500">Loading report details...</p>;
        }

        const data = reportDetails[key]?.data || reportDetails[key] || {};
        const reportObservations = data.observations || [];
        const observations = report.model === "LabReport"
            ? reportObservations.filter(observation => observation.testName === report.data?.testName)
            : reportObservations;
        const images = data.images || [];

        return (
            <div className="space-y-4 p-4 md:p-6 bg-slate-50">
                {observations.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Test / Parameter</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Result / Report</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Unit</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Reference range</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {observations.map((observation, index) => {
                                    const result = observation.result ?? observation.value ?? "-";
                                    const isImage = typeof result === "string" && /^https?:\/\//.test(result);
                                    return (
                                        <tr key={observation._id || index}>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                {observation.testName || observation.parameter || observation.observationIdentifier || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {isImage ? (
                                                    <button type="button" onClick={() => setPreviewImage(result)} className="text-blue-600 underline">
                                                        View report image
                                                    </button>
                                                ) : result}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{observation.units || observation.unitRef || "-"}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{observation.referenceRange || observation.range || "-"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No observation details available for this report.</p>
                )}
                {images.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                        {images.map((image, index) => (
                            <button key={`${image}-${index}`} type="button" onClick={() => setPreviewImage(image)}>
                                <img src={image} alt={`Report ${index + 1}`} className="h-28 w-36 rounded border border-gray-200 bg-white object-contain" />
                            </button>
                        ))}
                    </div>
                )}
                {data.rejectedReason && (
                    <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        Rejection reason: {data.rejectedReason}
                    </p>
                )}
                {report.model === "LabReport" && observations.length === 0 && (
                    <p className="text-xs text-gray-500">Uploaded report details will appear as images when available.</p>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <BreadCrumb paths={[
                { label: "Lab Operator Management", url: "/doctor/lab-operator" },
                { label: "Patient Test Names", url: "/doctor/lab-operator/all-reports" },
                { label: "Patient Reports" },
            ]} />

            <PagePath title="Patient Reports">
                <Button
                    label="Back to Patients"
                    icon="pi pi-arrow-left"
                    variant="secondary"
                    onClick={() => navigate("/doctor/lab-operator/all-reports")}
                />
                <Button
                    label="Refresh"
                    icon="pi pi-refresh"
                    variant="secondary"
                    onClick={() => {
                        setLoading(true);
                        loadReports();
                    }}
                    disabled={loading}
                />
            </PagePath>

            <div className="my-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-4">
                    <p><span className="font-semibold text-gray-500">Patient:</span> {patient?.patientName || reports[0]?.data?.patientName || "N/A"}</p>
                    <p><span className="font-semibold text-gray-500">UHID:</span> {uhid || "N/A"}</p>
                    <p><span className="font-semibold text-gray-500">Age:</span> {patient?.age ?? reports[0]?.data?.age ?? "N/A"}</p>
                    <p><span className="font-semibold text-gray-500">Gender:</span> {patient?.gender || reports[0]?.data?.gender || "N/A"}</p>
                </div>
            </div>

            {labReportDetailsError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {labReportDetailsError}
                </div>
            )}

            {loading ? (
                <div className="py-16 text-center text-gray-500">Loading patient reports...</div>
            ) : reports.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-gray-500">
                    No machine or lab reports found for this patient.
                </div>
            ) : (
                <>
                    {reports.some(report => (report.data?.status || "pending") === "pending") && (
                        <div className="mb-3 flex justify-end">
                            <Button
                                label="Send All for Approval"
                                icon="pi pi-send"
                                onClick={handleSendAllForApproval}
                                loading={sendingAllForApproval}
                                disabled={sendingAllForApproval || Object.values(cancellingReports).some(Boolean)}
                            />
                        </div>
                    )}
                    <div className="space-y-3">
                    {reports.map(report => {
                        const key = getReportKey(report);
                        const reportData = report.data || {};
                        const testName = reportData.testName || report.testName || report.reportType || report.model;
                        const isExpanded = expandedReport === key;
                        const status = reportData.status || "pending";

                        return (
                            <section key={key} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex flex-wrap items-center gap-3 p-4">
                                    <button
                                        type="button"
                                        onClick={() => toggleReport(report)}
                                        aria-expanded={isExpanded}
                                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${testName}`}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                                    >
                                        <i className={`pi ${isExpanded ? "pi-chevron-down" : "pi-chevron-right"}`} />
                                    </button>
                                    <div className="min-w-[180px] flex-1">
                                        <p className="font-semibold text-gray-800">{testName}</p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {report.reportType || report.model} · {reportData.date || date || "-"}
                                        </p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(status)}`}>
                                        {status}
                                    </span>
                                    {status === "pending" && (
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                label="Cancel"
                                                icon="pi pi-times"
                                                variant="secondary"
                                                onClick={() => {
                                                    setCancellationTarget({ report, key });
                                                    setCancellationRemark("");
                                                }}
                                                disabled={cancellingReports[key] || sendingAllForApproval}
                                            />
                                        </div>
                                    )}
                                </div>
                                {isExpanded && renderExpandedReport(report, key)}
                            </section>
                        );
                    })}
                    </div>
                </>
            )}

            {cancellationTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <form
                        onSubmit={event => {
                            event.preventDefault();
                            handleCancelReport();
                        }}
                        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                    >
                        <h2 className="text-lg font-semibold text-gray-900">Cancel test report</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Enter the reason for cancelling this report. The Lab Head will be able to view it.
                        </p>
                        <textarea
                            value={cancellationRemark}
                            onChange={event => setCancellationRemark(event.target.value)}
                            required
                            minLength={1}
                            rows={4}
                            maxLength={1000}
                            placeholder="Cancellation remark (required)"
                            className="mt-4 w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                label="Back"
                                variant="secondary"
                                onClick={() => {
                                    setCancellationTarget(null);
                                    setCancellationRemark("");
                                }}
                                disabled={Boolean(cancellingReports[cancellationTarget.key])}
                            />
                            <Button
                                label="Confirm Cancellation"
                                icon="pi pi-times"
                                type="submit"
                                loading={Boolean(cancellingReports[cancellationTarget.key])}
                                disabled={!cancellationRemark.trim() || Boolean(cancellingReports[cancellationTarget.key])}
                            />
                        </div>
                    </form>
                </div>
            )}

            {previewImage && (
                <ImageModal
                    src={previewImage}
                    alt="Report preview"
                    onClose={() => setPreviewImage(null)}
                />
            )}
        </div>
    );
}
