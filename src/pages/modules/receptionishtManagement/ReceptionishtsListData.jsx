import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';

const ActionButtons = ({ rowData, onEdit }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onEdit(rowData)}
        className="h-6 w-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200 flex items-center justify-center"
        title="Edit Receptionist"
      >
        <i className="pi pi-user-edit text-xs" />
      </button>
    </div>
  );
};

export default function ReceptionishtsListData() {
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(25);
  const navigate = useNavigate();

  const breadcrumbPaths = [
    { label: 'Receptionist Management' },
    { label: 'Receptionist List' }
  ];

  const nameBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-slate-800">{rowData.name}</p>
      </div>
    );
  };

  const emailBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-4 rounded-full bg-slate-100 flex items-center justify-center">
          <i className="pi pi-envelope text-slate-500 text-xs" />
        </div>

        <span className="text-sm text-slate-700">
          {rowData.email}
        </span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <ActionButtons
        rowData={rowData}
        onEdit={(data) => navigate(`/receptionist-management/edit/${data.id}`)}
      />
    );
  };

  const columns = [
    {
      field: 'id',
      header: 'Sr. No.',
      sortable: false,
      minWidth: '80px'
    },
    {
      field: 'name',
      header: 'Receptionist Name',
      sortable: true,
      body: nameBodyTemplate,
      minWidth: '250px'
    },
    {
      field: 'email',
      header: 'Email ID',
      sortable: true,
      body: emailBodyTemplate,
      minWidth: '300px'
    },
    {
      field: 'action',
      header: 'Actions',
      sortable: false,
      body: actionBodyTemplate,
      minWidth: '150px'
    }
  ];

  const generateMockData = (count) => {
    const names = ['Alice Smith', 'Bob Jones', 'Charlie Brown', 'Diana Prince', 'Eve Adams'];
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: names[i % names.length] + (i > 4 ? ` ${i}` : ''),
      email: `${names[i % names.length].split(' ')[0].toLowerCase()}${i}@unisol.com`
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const allData = generateMockData(totalRecords);
      let filteredData = allData;

      if (globalFilter) {
        filteredData = allData.filter(item =>
          item.email.toLowerCase().includes(globalFilter.toLowerCase())
        );
      }

      const paginatedData = filteredData.slice(first, first + rows);
      setReceptionists(paginatedData);
      setTotalRecords(filteredData.length > 0 && !globalFilter ? 25 : filteredData.length);
      setLoading(false);
    };

    fetchData();
  }, [first, rows, globalFilter]);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title="Receptionist List"
        showSearchBar={true}
        searchValue={globalFilter}
        searchPlaceholder="Search by email"
        onSearch={setGlobalFilter}
        showAddButton={true}
        addButtonLabel="Add Receptionist"
        onAdd={() => navigate('/receptionist-management/add')}
      />

      <DataTable
        data={receptionists}
        columns={columns}
        loading={loading}
        emptyMessage="No receptionists found."
      />

      <Pagination
        currentPage={Math.floor(first / rows) + 1}
        totalPages={Math.ceil(totalRecords / rows) || 1}
        totalItems={totalRecords}
        itemsPerPage={rows}
        showRowPerPage={true}
        onPageChange={(page) => setFirst((page - 1) * rows)}
        onItemsPerPageChange={(value) => {
          setRows(value);
          setFirst(0);
        }}
      />
    </div>
  );
}
