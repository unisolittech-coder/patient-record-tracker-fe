// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import BreadCrumb from "../../../components/common/BreadCrumb";
// import PagePath from "../../../components/common/PagePath";
// import DataTable from "../../../components/common/DataTable";
// import Button from "../../../components/common/Button";
// import useLabOperatorManagment from "../../../hooks/lab/labOperatorManagment/useLabOperatorManagment";

// export default function LabOperatorRejectedReports() {
//     const { loading, labRejectedReports, fetchLabRejectedReports } = useLabOperatorManagment();
//     const navigate = useNavigate();
//     const [search, setSearch] = useState("");

//     const breadcrumbPaths = [
//         { label: "Lab Operator Management" , url: "/doctor/lab-operator" },
//         { label: "Rejected Reports" },
//     ];

//     useEffect(() => {
//         fetchLabRejectedReports();
//     }, []);

//     const flatReports = labRejectedReports?.flatMap((report) => {
//         const data = report.data || {};
//         const observations = data.observations || [];
//         const images = data.images || [];

//         const patientName = data.employeeName || data.patientName || "N/A";
//         const base = {
//             uhid: data.UHID || "N/A",
//             patientName,
//             testName: data.testName || report.reportType || "-",
//             reportType: report.reportType || "-",
//             model: report.model || "-",
//             date: data.date ? new Date(data.date).toLocaleDateString() : "-",
//             status: data.status || "rejected",
//             mobileNumber: data.mobileNumber || "N/A",
//             abhaNumber: data.abhaNumber || "N/A",
//             uniqueId: data.uniqueId || report._id,
//             report,
//         };

//         if (observations.length > 0) {
//             return observations.map((obs) => ({
//                 ...base,
//                 parameter: obs.parameter || "-",
//                 result: obs.result || null,
//                 unitRef: obs.unitRef || "",
//                 range: obs.range || "",
//             }));
//         }

//         if (images.length > 0) {
//             return images.map((img) => ({
//                 ...base,
//                 parameter: data.testName || "-",
//                 result: img,
//                 unitRef: "",
//                 range: "",
//             }));
//         }

//         return [{
//             ...base,
//             parameter: data.testName || "-",
//             result: images[0] || null,
//             unitRef: "",
//             range: "",
//         }];
//     }) || [];

//     const filteredData = flatReports
//         .filter((item) => {
//             const q = search.toLowerCase();
//             return (
//                 (item.uhid || "").toLowerCase().includes(q) ||
//                 (item.patientName || "").toLowerCase().includes(q) ||
//                 (item.testName || "").toLowerCase().includes(q) ||
//                 (item.parameter || "").toLowerCase().includes(q)
//             );
//         })
//         .map((item, index) => ({
//             ...item,
//             srNo: index + 1,
//         }));

//     const statusBodyTemplate = (rowData) => {
//         const isRejected = rowData.status === "rejected";
//         return (
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                 isRejected
//                     ? "bg-red-100 text-red-800"
//                     : "bg-green-100 text-green-800"
//             }`}>
//                 {rowData.status}
//             </span>
//         );
//     };

//     const reportBodyTemplate = (rowData) => {
//         if (!rowData.result) {
//             return <span className="text-slate-400 text-sm">No file</span>;
//         }
//         return (
//             <a
//                 href={rowData.result}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 title="View Report"
//             >
//                 <img
//                     src={rowData.result}
//                     alt="report"
//                     className="h-12 w-12 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80"
//                 />
//             </a>
//         );
//     };

//     const actionBodyTemplate = (rowData) => {
//         const queryParams = new URLSearchParams({
//             model: rowData.model || "",
//             testName: rowData.testName || "",
//             uhid: rowData.uhid || "",
//         }).toString();

//         return (
//             <div className="flex items-center justify-center">
//                 <button
//                     onClick={() => navigate(`/doctor/lab-operator/rejected-report/view?${queryParams}`)}
//                     className="h-6 w-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
//                     title="View Rejected Report"
//                 >
//                     <i className="pi pi-eye text-xs" />
//                 </button>
//             </div>
//         );
//     };

//     const columns = [
//         {
//             field: "srNo",
//             header: "Sr. No.",
//             sortable: false,
//             minWidth: "80px",
//         },
//         {
//             field: "uhid",
//             header: "UHID",
//             sortable: true,
//             minWidth: "120px",
//         },
//         // {
//         //     field: "patientName",
//         //     header: "Patient Name",
//         //     sortable: true,
//         //     minWidth: "180px",
//         // },
//         {
//             field: "testName",
//             header: "Test Name",
//             sortable: true,
//             minWidth: "140px",
//         },
//         {
//             field: "parameter",
//             header: "Parameter",
//             sortable: true,
//             minWidth: "120px",
//         },
//         {
//             field: "reportType",
//             header: "Report Type",
//             sortable: true,
//             minWidth: "130px",
//         },
//         {
//             field: "model",
//             header: "Model",
//             sortable: true,
//             minWidth: "120px",
//         },
//         {
//             field: "date",
//             header: "Date",
//             sortable: true,
//             minWidth: "130px",
//         },
//         {
//             field: "status",
//             header: "Status",
//             sortable: true,
//             body: statusBodyTemplate,
//             minWidth: "110px",
//         },
//         {
//             field: "result",
//             header: "Report",
//             sortable: false,
//             body: reportBodyTemplate,
//             minWidth: "100px",
//         },
//         {
//             field: "action",
//             header: "Actions",
//             sortable: false,
//             body: actionBodyTemplate,
//             minWidth: "100px",
//         },
//     ];

//     return (
//         <div className="max-w-7xl mx-auto pb-12">
//             <BreadCrumb paths={breadcrumbPaths} />

//             <PagePath
//                 title="Rejected Reports"
//                 showSearchBar={true}
//                 searchValue={search}
//                 searchPlaceholder="Search by UHID, patient name, test or parameter"
//                 onSearch={setSearch}
//             >
//                 <Button
//                     label="Refresh"
//                     icon="pi pi-refresh"
//                     variant="secondary"
//                     onClick={() => fetchLabRejectedReports()}
//                     disabled={loading}
//                 />
//             </PagePath>

//             <DataTable
//                 data={filteredData}
//                 columns={columns}
//                 loading={loading}
//                 emptyMessage="No rejected reports found."
//             />
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import DataTable from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import Button from "../../../components/common/Button";
import useLabOperatorManagment from "../../../hooks/lab/labOperatorManagment/useLabOperatorManagment";

export default function LabOperatorRejectedReports() {
    const {
        loading,
        labRejectedReports,
        fetchLabRejectedReports,
    } = useLabOperatorManagment();

    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const breadcrumbPaths = [
        {
            label: "Lab Operator Management",
            url: "/doctor/lab-operator",
        },
        {
            label: "Rejected Reports",
        },
    ];

    useEffect(() => {
        fetchLabRejectedReports({ page, limit });
    }, [page, limit]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleItemsPerPageChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const reportsArray = Array.isArray(labRejectedReports)
        ? labRejectedReports
        : Array.isArray(labRejectedReports?.reports)
        ? labRejectedReports.reports
        : [];

    const flatReports = reportsArray.flatMap((report) => {
        const data = report?.data || {};

        const observations = Array.isArray(data.observations)
            ? data.observations
            : [];

        const images = Array.isArray(data.images)
            ? data.images
            : [];

        const patientName =
            data.employeeName ||
            data.patientName ||
            "N/A";

        const base = {
            uhid: data.UHID || "N/A",

            patientName,

            testName:
                data.testName ||
                report.reportType ||
                "-",

            reportType:
                report.reportType ||
                "-",

            model:
                report.model ||
                "-",

            // ORIGINAL API DATE
            // Example: 2026-09-17
            date: data.date || "-",

            // Only for displaying in table
            displayDate: data.date
                ? new Date(`${data.date}T00:00:00`).toLocaleDateString()
                : "-",

            status:
                data.status ||
                "rejected",

            mobileNumber:
                data.mobileNumber ||
                "N/A",

            abhaNumber:
                data.abhaNumber ||
                "N/A",

            uniqueId:
                data.uniqueId ||
                report._id,

            report,
        };

        /*
         * If observations exist,
         * create one row per observation.
         */
        if (observations.length > 0) {
            return observations.map((obs) => ({
                ...base,

                parameter:
                    obs.parameter ||
                    "-",

                result:
                    obs.result ||
                    null,

                unitRef:
                    obs.unitRef ||
                    "",

                range:
                    obs.range ||
                    "",
            }));
        }

        /*
         * If images exist,
         * create one row per image.
         */
        if (images.length > 0) {
            return images.map((img) => ({
                ...base,

                parameter:
                    data.testName ||
                    "-",

                result:
                    img ||
                    null,

                unitRef: "",
                range: "",
            }));
        }

        /*
         * If there are no observations/images,
         * still show the report row.
         */
        return [
            {
                ...base,

                parameter:
                    data.testName ||
                    "-",

                result:
                    null,

                unitRef: "",
                range: "",
            },
        ];
    });

    /*
     * Search filtering
     */
    const filteredData = flatReports
        .filter((item) => {
            const q = search.toLowerCase().trim();

            return (
                (item.uhid || "")
                    .toLowerCase()
                    .includes(q) ||

                (item.patientName || "")
                    .toLowerCase()
                    .includes(q) ||

                (item.testName || "")
                    .toLowerCase()
                    .includes(q) ||

                (item.parameter || "")
                    .toLowerCase()
                    .includes(q)
            );
        })
        .map((item, index) => ({
            ...item,
            srNo: index + 1,
        }));

    /*
     * Status column
     */
    const statusBodyTemplate = (rowData) => {
        const isRejected =
            rowData.status === "rejected";

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isRejected
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                }`}
            >
                {rowData.status}
            </span>
        );
    };

    /*
     * Report image column
     */
    const reportBodyTemplate = (rowData) => {
        if (!rowData.result) {
            return (
                <span className="text-slate-400 text-sm">
                    No file
                </span>
            );
        }

        return (
            <a
                href={rowData.result}
                target="_blank"
                rel="noopener noreferrer"
                title="View Report"
            >
                <img
                    src={rowData.result}
                    alt="report"
                    className="h-12 w-12 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80"
                />
            </a>
        );
    };

    /*
     * Action
     */
    const actionBodyTemplate = (rowData) => {
        const queryParams = new URLSearchParams({
            model: rowData.model || "",
            testName: rowData.testName || "",
            uhid: rowData.uhid || "",

            // IMPORTANT:
            // This sends the ORIGINAL API date
            // Example: 2026-09-17
            date: rowData.date || "",
        }).toString();

        

        return (
            <div className="flex items-center justify-center">
                <button
                    onClick={() =>
                        navigate(
                            `/doctor/lab-operator/rejected-report/view?${queryParams}`
                        )
                    }
                    className="h-6 w-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
                    title="View Rejected Report"
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
            field: "testName",
            header: "Test Name",
            sortable: true,
            minWidth: "140px",
        },
        {
            field: "parameter",
            header: "Parameter",
            sortable: true,
            minWidth: "120px",
        },
        {
            field: "reportType",
            header: "Report Type",
            sortable: true,
            minWidth: "130px",
        },
        {
            field: "model",
            header: "Model",
            sortable: true,
            minWidth: "120px",
        },
        {
            // Display formatted date
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
        {
            field: "result",
            header: "Report",
            sortable: false,
            body: reportBodyTemplate,
            minWidth: "100px",
        },
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
                title="Rejected Reports"
                showSearchBar={true}
                searchValue={search}
                searchPlaceholder="Search by UHID, patient name, test or parameter"
                onSearch={setSearch}
            >
                <Button
                    label="Refresh"
                    icon="pi pi-refresh"
                    variant="secondary"
                    onClick={() =>
                        fetchLabRejectedReports({ page, limit })
                    }
                    disabled={loading}
                />
            </PagePath>

            <DataTable
                data={filteredData}
                columns={columns}
                loading={loading}
                emptyMessage="No rejected reports found."
            />
                  <Pagination
        currentPage={labRejectedReports?.pagination?.page}
        totalPages={labRejectedReports?.pagination?.totalPages}
        totalItems={labRejectedReports?.pagination?.total}
        itemsPerPage={labRejectedReports?.pagination?.limit}
        showRowPerPage={true}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
        </div>
    );
}