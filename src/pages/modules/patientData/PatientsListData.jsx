// src/pages/modules/patientData/PatientsListData.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import usePatientMgmt from '../../../hooks/patientMgmt/usePatientMgmt';
import useDebounce from '../../../hooks/debounce/useDebounce';

const ActionButtons = ({ rowData, onView }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onView(rowData)}
        className="h-6 w-10 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
      >
        <i className="pi pi-eye" />
      </button>
    </div>
  );
};

export default function PatientsListData() {
  const navigate = useNavigate();
  const { fetchPatients, loading, patientRes } = usePatientMgmt();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const breadcrumbPaths = [
    { label: 'Patient Data', url: '/patient-data' },
    { label: 'Patients List' }
  ];

  useEffect(() => {
    fetchPatients(page, limit, debouncedSearch);
  }, [fetchPatients, page, limit, debouncedSearch]);

  console.log("patientRes", patientRes);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Enhanced Mobile Template
  const mobileBodyTemplate = (rowData) => {
    const mobile = rowData.mobileNumber;
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-6 rounded-full bg-indigo-50 flex items-center justify-center transition-colors duration-200">
          <i className="pi pi-phone text-indigo-500 text-sm" />
        </div>
        <span className="font-mono text-sm font-medium text-slate-700">{mobile}</span>
      </div>
    );
  };

  // Enhanced Patient ID Template
  const patientIdBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold text-slate-700">{rowData.uhid}</span>
      </div>
    );
  };

  // Enhanced Action Template
  const actionBodyTemplate = (rowData) => {
    return (
      <ActionButtons
        rowData={rowData}
        onView={data => navigate(`/patient-data/view/${encodeURIComponent(data.uhid)}`)}
      />
    );
  };

  const tableData =
    patientRes?.data?.map((item, index) => ({
      ...item,
      srNo: (page - 1) * limit + index + 1,
    })) || [];

  const columns = [
    {
      field: 'srNo',
      header: 'Sr. No.',
      sortable: false,
      minWidth: '10px'
    },
    {
      field: 'uhid',
      header: 'MRID',
      sortable: true,
      body: patientIdBodyTemplate,
      minWidth: '100px'
    },
    {
      field: 'patientName',
      header: 'Patient Name',
      sortable: true,
      minWidth: '180px'
    },
       {
      field: 'mobileNumber',
      header: 'Mobile Number',
      sortable: false,
      body: mobileBodyTemplate,
      minWidth: '120px'
    },
    {
      field: 'abhaNumber',
      header: 'ABHA Number',
      sortable: true,
      minWidth: '100px'
    },
    {
      field: 'action',
      header: 'Actions',
      sortable: false,
      body: actionBodyTemplate,
      minWidth: '90px'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title="Patients List"
        showSearchBar={true}
        searchValue={search}
        searchPlaceholder="Search by MRID, patient name, mobile or ABHA number"
        onSearch={setSearch}
      />

      <DataTable
        data={tableData}
        columns={columns}
        loading={loading}
        emptyMessage="No patients found matching your search criteria."
      />

      <Pagination
        currentPage={patientRes?.pagination?.page}
        totalPages={patientRes?.pagination?.totalPages}
        totalItems={patientRes?.pagination?.total}
        itemsPerPage={patientRes?.pagination?.limit}
        showRowPerPage={true}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
} 
