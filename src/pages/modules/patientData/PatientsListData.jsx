// src/pages/modules/patientData/PatientsListData.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import usePatientMgmt from '../../../hooks/patientMgmt/usePatientMgmt';
import useDebounce from '../../../hooks/debounce/useDebounce';

const ActionButtons = ({ rowData, onView, onEdit }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onView(rowData)}
        className="h-6 w-10 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
      >
        <i className="pi pi-eye" />
      </button>

      <button
        onClick={() => onEdit(rowData)}
        className="h-6 w-10 rounded-xl bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200 flex items-center justify-center"
      >
        <i className="pi pi-user-edit" />
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
  }, [page, limit, debouncedSearch]);

  console.log("patientRes", patientRes);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const genderBodyTemplate = (rowData) => {
    const gender = rowData.gender || 'Male';
    const config = {
      Male: { icon: 'pi pi-mars', color: 'text-blue-500', bg: 'bg-blue-50' },
      Female: { icon: 'pi pi-venus', color: 'text-pink-500', bg: 'bg-pink-50' },
      Other: { icon: 'pi pi-user', color: 'text-purple-500', bg: 'bg-purple-50' }
    };
    const { icon, color, bg } = config[gender] || config.Male;

    return (
      <div className="flex items-center gap-2">
        <div className={`w-8 h-6 rounded-full ${bg} flex items-center justify-center transition-colors duration-200`}>
          <i className={`${icon} ${color} text-sm`} />
        </div>
        <span className="text-sm font-medium text-slate-700">{gender}</span>
      </div>
    );
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

  // Enhanced City Template
  const cityBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-6 rounded-full bg-cyan-50 flex items-center justify-center transition-colors duration-200">
          <i className="pi pi-map-marker text-cyan-500 text-sm" />
        </div>
        <span className="text-sm font-medium text-slate-700">{rowData.city}</span>
      </div>
    );
  };

  // Enhanced Patient ID Template
  const patientIdBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold text-slate-700">{rowData.patientId}</span>
      </div>
    );
  };

  // Enhanced Action Template
  const actionBodyTemplate = (rowData) => {
    const handleView = (data) => {
      navigate(`/patient-data/view/${data._id}`);
    };
    const handleEdit = (data) => {
      navigate(`/patient-data/edit/${data._id}`);
    };
    const handleDelete = (data) => {
      if (window.confirm(`Are you sure you want to delete ${data.patientName}?`)) {
        console.log('Delete patient:', data);
      }
    };

    return (
      <ActionButtons
        rowData={rowData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
      field: 'patientId',
      header: 'Patient ID',
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
      field: 'gender',
      header: 'Gender',
      sortable: true,
      body: genderBodyTemplate,
      minWidth: '100px'
    },
    {
      field: 'mobileNumber',
      header: 'Mobile Number',
      sortable: false,
      body: mobileBodyTemplate,
      minWidth: '120px'
    },
    {
      field: 'city',
      header: 'City',
      sortable: true,
      body: cityBodyTemplate,
      minWidth: '100px'
    },
    {
      field: 'action',
      header: 'Actions',
      sortable: false,
      body: actionBodyTemplate,
      minWidth: '100px'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title="Patients List"
        showSearchBar={true}
        searchValue={search}
        searchPlaceholder="Search by patient ID, ..."
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
