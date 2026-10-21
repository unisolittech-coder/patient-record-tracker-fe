import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import DataTable from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import useLabHeadManagment from "../../../hooks/lab/labHeadManagment/useLabHeadManagment";

const ActionButtons = ({ rowData, onView }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onView(rowData)}
        className="h-6 w-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
        title="View patient reports"
      >
        <i className="pi pi-eye text-xs" />
      </button>
    </div>
  );
};

export default function LabHeadManagment() {
  const { fetchLabHeads, loading, labHeadRes } = useLabHeadManagment();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const breadcrumbPaths = [
    { label: "Patient Reports Management" },
    { label: "Patient Report List" },
  ];

  useEffect(() => {
    fetchLabHeads(page, limit, "");
  }, [fetchLabHeads, page, limit]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <ActionButtons
        rowData={rowData}
        onView={(data) => navigate(
          `/doctor/lab-head/view/${data.uhid}?date=${encodeURIComponent(data.date)}`
        )}
      />
    );
  };

  const tableData = labHeadRes?.data || [];

  const testNamesBodyTemplate = (rowData) => {
    const statusStyles = {
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-gray-200 text-gray-700",
      pending: "bg-amber-100 text-amber-800",
    };

    return (
      <div className="flex flex-wrap gap-2">
        {(rowData.testNames || []).map((test, index) => {
          const testName = typeof test === "string" ? test : test.testName;
          const status = String(typeof test === "string" ? "pending" : test.status || "pending").toLowerCase();

          return (
            <span key={`${testName}-${index}`} className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-2.5 py-1 text-xs">
              <span className="font-medium text-gray-800">{testName}</span>
              <span className={`rounded-full px-2 py-0.5 font-medium ${statusStyles[status] || "bg-blue-100 text-blue-800"}`}>
                {status.replaceAll("_", " ")}
              </span>
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
      field: "patientName",
      header: "Patient Name",
      sortable: true,
      minWidth: "180px",
    },
    {
      field: "date",
      header: "Date",
      sortable: true,
      body: rowData => rowData.date
        ? new Date(`${rowData.date}T00:00:00`).toLocaleDateString()
        : "-",
      minWidth: "130px",
    },
    {
      field: "testNames",
      header: "Tests / Status",
      sortable: false,
      body: testNamesBodyTemplate,
      minWidth: "360px",
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
        title="Patient Reports Management"
        // showSearchBar={true}
        // searchValue={search}
        // searchPlaceholder="Search by patient name or ID"
        // onSearch={setSearch}
      />

      <DataTable
        data={tableData}
        columns={columns}
        loading={loading}
        emptyMessage="No registered patient tests found."
      />

      <Pagination
        currentPage={labHeadRes?.pagination?.page}
        totalPages={labHeadRes?.pagination?.totalPages}
        totalItems={labHeadRes?.pagination?.total}
        itemsPerPage={labHeadRes?.pagination?.limit}
        showRowPerPage={true}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
