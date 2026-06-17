// src/pages/modules/patientData/PatientsListData.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';

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
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(50);
  const navigate = useNavigate();

  const breadcrumbPaths = [
    { label: 'Patient Data', url: '/patient-data' },
    { label: 'Patients List' }
  ];

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
    const mobile = rowData.mobile || '9876543210';
    const formatted = mobile.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-6 rounded-full bg-indigo-50 flex items-center justify-center transition-colors duration-200">
          <i className="pi pi-phone text-indigo-500 text-sm" />
        </div>
        <span className="font-mono text-sm font-medium text-slate-700">{formatted}</span>
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

  // Enhanced Name Template
  const nameBodyTemplate = (rowData) => {

    return (
      <div className="flex items-center gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-800">{rowData.name}</p>
        </div>
      </div>
    );
  };

  // Enhanced Action Template
  const actionBodyTemplate = (rowData) => {
    const handleView = (data) => {
      navigate(`/patient-data/view/${data.patientId}`);
    };
    const handleEdit = (data) => {
      navigate(`/patient-data/edit/${data.patientId}`);
    };
    const handleDelete = (data) => {
      if (window.confirm(`Are you sure you want to delete ${data.name}?`)) {
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

  const columns = [
    {
      field: 'id',
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
      field: 'name',
      header: 'Patient Name',
      sortable: true,
      body: nameBodyTemplate,
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
      field: 'mobile',
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

  // Generate mock data
  const generateMockData = (start, count) => {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kolkata'];
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rahul', 'Neha', 'Deepak', 'Kavita'];
    const lastNames = ['Kumar', 'Sharma', 'Patel', 'Reddy', 'Singh', 'Gupta', 'Verma', 'Jain', 'Nair', 'Rao'];

    return Array.from({ length: count }, (_, i) => {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      return {
        id: start + i + 1,
        patientId: `PID-${String(1000 + start + i).padStart(4, '0')}`,
        name: `${firstName} ${lastName}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        mobile: `987654${String(3210 + i).padStart(4, '0')}`,
        city: cities[i % cities.length],
      };
    });
  };

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      const allData = generateMockData(0, totalRecords);

      let filteredData = allData;
      if (globalFilter) {
        filteredData = allData.filter(item =>
          item.patientId.toLowerCase().includes(globalFilter.toLowerCase()) ||
          item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
          item.mobile.includes(globalFilter) ||
          item.city.toLowerCase().includes(globalFilter.toLowerCase())
        );
      }

      const paginatedData = filteredData.slice(first, first + rows);
      setPatients(paginatedData);
      setTotalRecords(filteredData.length);
      setLoading(false);
    };

    fetchData();
  }, [first, rows, globalFilter]);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title="Patients List"
        showSearchBar={true}
        searchValue={globalFilter}
        searchPlaceholder="Search by patient ID"
        onSearch={setGlobalFilter}
      />

      <DataTable
        data={patients}
        columns={columns}
        loading={loading}
        emptyMessage="No patients found matching your search criteria."
      />

      <Pagination
        currentPage={Math.floor(first / rows) + 1}
        totalPages={Math.ceil(totalRecords / rows)}
        totalItems={totalRecords}
        itemsPerPage={rows}
        showRowPerPage={true}
        onPageChange={(page) => {
          setFirst((page - 1) * rows);
        }}
        onItemsPerPageChange={(value) => {
          setRows(value);
          setFirst(0);
        }}
      />
    </div>
  );
}