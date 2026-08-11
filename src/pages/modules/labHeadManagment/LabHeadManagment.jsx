import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import DataTable from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import useDebounce from "../../../hooks/debounce/useDebounce";
import useLabHeadManagment from "../../../hooks/lab/labOperator/useLabHeadManagment";

const ActionButtons = ({ rowData, onView }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onView(rowData)}
        className="h-6 w-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
        title="View Lab Head"
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
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const breadcrumbPaths = [
    { label: "Lab Head Management" },
    { label: "Lab Head List" },
  ];

  useEffect(() => {
    fetchLabHeads(page, limit, debouncedSearch);
  }, [page, limit, debouncedSearch]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <ActionButtons
        rowData={rowData}
        onView={(data) => navigate(`/doctor/lab-head/view/${data.uniqueId}`)}
      />
    );
  };

  const testDateBodyTemplate = (rowData) => {
    return (
      <span className="text-sm text-slate-700">
        {rowData.testDate ? new Date(rowData.testDate).toLocaleDateString() : "-"}
      </span>
    );
  };

  const tableData =
    labHeadRes?.data?.map((item, index) => ({
      ...item,
      srNo: (page - 1) * limit + index + 1,
    })) || [];

  const columns = [
    {
      field: "srNo",
      header: "Sr. No.",
      sortable: false,
      minWidth: "80px",
    },
    {
      field: "uniqueId",
      header: "Unique ID",
      sortable: true,
      minWidth: "120px",
    },
    {
      field: "patientId",
      header: "Patient ID",
      sortable: true,
      minWidth: "140px",
    },
    {
      field: "patientName",
      header: "Patient Name",
      sortable: true,
      minWidth: "200px",
    },
    {
      field: "mobileNumber",
      header: "Mobile Number",
      sortable: true,
      minWidth: "160px",
    },
    {
      field: "testDate",
      header: "Test Date",
      sortable: true,
      body: testDateBodyTemplate,
      minWidth: "140px",
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
        title="Lab Head Management"
        showSearchBar={true}
        searchValue={search}
        searchPlaceholder="Search by patient name or ID"
        onSearch={setSearch}
      />

      <DataTable
        data={tableData}
        columns={columns}
        loading={loading}
        emptyMessage="No lab head records found."
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
