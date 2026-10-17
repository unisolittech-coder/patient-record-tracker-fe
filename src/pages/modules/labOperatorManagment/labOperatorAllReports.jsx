import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import DataTable from "../../../components/common/DataTable";
import Button from "../../../components/common/Button";
import useLabOperatorManagment from "../../../hooks/lab/labOperatorManagment/useLabOperatorManagment";

export default function LabOperatorAllReports() {
    const { loading, labAllReports, fetchLabAllReports, labAllReportsError } = useLabOperatorManagment();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const breadcrumbPaths = [
        { label: "Lab Operator Management", url: "/doctor/lab-operator" },
        { label: "All Reports" },
    ];

    useEffect(() => {
        fetchLabAllReports();
    }, [fetchLabAllReports]);

    const flatReports = (labAllReports || []).map((report, index) => {
        const data = report.data || {};
        return {
            srNo: index + 1,
            uhid: data.UHID || "N/A",
            patientName:  data.patientName || "N/A",
            testName: data.testName || "-",
            // reportType: report.reportType || "-",
            model: report.model || "-",
            date: data.date || "",
            displayDate: data.date ? new Date(data.date).toLocaleDateString() : "-",
            status: data.status || "pending",
            // images: data.images || [],
            rejectedReason: data.rejectedReason || "",
            report,
        };
    }) || [];

    const filteredData = flatReports
        .filter((item) => {
            const q = search.toLowerCase();
            return (
                (item.uhid || "").toLowerCase().includes(q) ||
                (item.patientName || "").toLowerCase().includes(q) ||
                (item.testName || "").toLowerCase().includes(q) ||
                (item.model || "").toLowerCase().includes(q) ||
                (item.status || "").toLowerCase().includes(q)
            );
        })
        .map((item, index) => ({
            ...item,
            srNo: index + 1,
        }));

    const statusBodyTemplate = (rowData) => {
        const status = rowData.status || "pending";
        const statusClasses = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}>
                {status}
            </span>
        );
    };

    const actionBodyTemplate = (rowData) => {
        const queryParams = new URLSearchParams({
            model: rowData.model || "",
            uhid: rowData.uhid || "",
            date: rowData.date || "",
        }).toString();

        return (
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => navigate(`/doctor/lab-operator/all-report/view?${queryParams}`)}
                    className="h-6 w-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
                    title="View Report"
                >
                    <i className="pi pi-eye text-xs" />
                </button>
            </div>
        );
    };

    const columns = [
        {
            field: "srNo",
            header: "Sr. No.",
            sortable: false,
            minWidth: "80px",
        },
        {
            field: "uhid",
            header: "UHID",
            sortable: true,
            minWidth: "120px",
        },
        {
            field: "patientName",
            header: "Patient Name",
            sortable: true,
            minWidth: "180px",
        },
        {
            field: "testName",
            header: "Test Name",
            sortable: true,
            minWidth: "140px",
        },
        // {
        //     field: "reportType",
        //     header: "Report Type",
        //     sortable: true,
        //     minWidth: "130px",
        // },
        {
            field: "model",
            header: "Model",
            sortable: true,
            minWidth: "120px",
        },
        {
            field: "displayDate",
            header: "Date",
            sortable: true,
            minWidth: "130px",
        },
        {
            field: "status",
            header: "Status",
            sortable: true,
            body: statusBodyTemplate,
            minWidth: "110px",
        },
        // {
        //     field: "images",
        //     header: "Image",
        //     sortable: false,
        //     body: imagesBodyTemplate,
        //     minWidth: "100px",
        // },
        {
            field: "action",
            header: "Actions",
            sortable: false,
            body: actionBodyTemplate,
            minWidth: "100px",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <BreadCrumb paths={breadcrumbPaths} />

            <PagePath
                title="Reports"
                showSearchBar={true}
                searchValue={search}
                searchPlaceholder="Search by UHID, patient name, test, model or status"
                onSearch={setSearch}
            >
                <Button
                    label="Rejected Reports"
                    icon="pi pi-plus"
                    variant="primary"
                    onClick={() => navigate("/doctor/lab-operator/rejected-reports")}
                    disabled={loading}
                />
            </PagePath>

            {labAllReportsError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3 text-red-700">
                        <i className="pi pi-exclamation-circle text-xl"></i>
                        <p className="text-sm">{labAllReportsError}</p>
                    </div>
                </div>
            )}

            <DataTable
                data={filteredData}
                columns={columns}
                loading={loading}
                emptyMessage="No lab reports found."
            />

        </div>
    );
}
