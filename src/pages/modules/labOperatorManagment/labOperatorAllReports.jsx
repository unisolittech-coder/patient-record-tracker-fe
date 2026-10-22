import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import DataTable from "../../../components/common/DataTable";
import Button from "../../../components/common/Button";
import Pagination from "../../../components/common/Pagination";
import useLabOperatorManagment from "../../../hooks/lab/labOperatorManagment/useLabOperatorManagment";
import useDebounce from "../../../hooks/debounce/useDebounce";

export default function LabOperatorAllReports() {
    const {
        labAllReportsLoading: loading,
        labAllReports,
        fetchLabAllReports,
        labAllReportsError,
    } = useLabOperatorManagment();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const debouncedSearch = useDebounce(search, 500);

    const breadcrumbPaths = [
        { label: "Lab Operator Management", url: "/doctor/lab-operator" },
        { label: "Patient Test Names" },
    ];

    useEffect(() => {
        fetchLabAllReports({ page, limit, search: debouncedSearch });
    }, [fetchLabAllReports, page, limit, debouncedSearch]);

    const currentPatients = Array.isArray(labAllReports)
        ? labAllReports
        : Array.isArray(labAllReports?.patients)
            ? labAllReports.patients
            : Array.isArray(labAllReports?.data?.patients)
                ? labAllReports.data.patients
                : [];
    const tableData = currentPatients
        .filter(item => item && typeof item === "object")
        .map((item, index) => ({
            ...item,
            srNo: (page - 1) * limit + index + 1,
        }));

    const testNamesBodyTemplate = (rowData) => {
        const testNames = Array.isArray(rowData?.testNames) ? rowData.testNames : [];

        return (
            <div className="flex flex-wrap gap-2">
                {testNames.map((test, index) => {
                    const testName = typeof test === "string"
                        ? test
                        : String(test?.testName || "").trim();
                    if (!testName) return null;

                    return (
                        <span key={`${testName}-${index}`} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {testName}
                        </span>
                    );
                })}
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
            header: "MRID",
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
            field: "gender",
            header: "Gender",
            sortable: true,
            minWidth: "100px",
        },
        {
            field: "age",
            header: "Age",
            sortable: true,
            minWidth: "80px",
        },
        {
            field: "date",
            header: "Test Date",
            sortable: true,
            body: rowData => rowData.date
                ? new Date(`${rowData.date}T00:00:00`).toLocaleDateString()
                : "-",
            minWidth: "130px",
        },
        {
            field: "testNames",
            header: "Test Names",
            sortable: false,
            body: testNamesBodyTemplate,
            minWidth: "260px",
        },
        {
            field: "actions",
            header: "Reports",
            sortable: false,
            body: rowData => (
                <button
                    type="button"
                    onClick={() => navigate(`/doctor/lab-operator/all-report/view?uhid=${encodeURIComponent(rowData.uhid)}&date=${encodeURIComponent(rowData.date || "")}`)}
                    className="h-8 w-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                    title="View patient reports"
                    aria-label={`View reports for ${rowData.patientName}`}
                >
                    <i className="pi pi-eye" />
                </button>
            ),
            minWidth: "90px",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <BreadCrumb paths={breadcrumbPaths} />

            <PagePath
                title="Patient Test Names"
                showSearchBar={true}
                searchValue={search}
                searchPlaceholder="Search by MRID, patient name, date or test name"
                onSearch={value => {
                    setSearch(value);
                    setPage(1);
                }}
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
                data={tableData}
                columns={columns}
                loading={loading}
                emptyMessage="No patient test names found for available test dates."
            />

            <Pagination
                currentPage={labAllReports?.pagination?.page}
                totalPages={labAllReports?.pagination?.totalPages}
                totalItems={labAllReports?.pagination?.total}
                itemsPerPage={labAllReports?.pagination?.limit}
                showRowPerPage={true}
                onPageChange={setPage}
                onItemsPerPageChange={newLimit => {
                    setLimit(newLimit);
                    setPage(1);
                }}
            />
        </div>
    );
}
