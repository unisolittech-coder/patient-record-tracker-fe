import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import useDebounce from '../../../hooks/debounce/useDebounce';
import useReceptionistMgmt from '../../../hooks/receptionishtManagement/useReceptionistMgmt';

const ActionButtons = ({ rowData, onEdit }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onEdit(rowData)}
        className="h-6 w-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200 flex items-center justify-center"
        title="Edit Data Entry Operator"
      >
        <i className="pi pi-user-edit text-xs" />
      </button>
    </div>
  );
};

export default function ReceptionishtsListData() {
  const { fetchReceptionists, loading, receptionistRes } = useReceptionistMgmt();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const breadcrumbPaths = [
    { label: 'Data Entry Operator Management' },
    { label: 'Data Entry Operator List' }
  ];

  useEffect(() => {
    fetchReceptionists(page, limit, debouncedSearch);
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
        onEdit={(data) => navigate(`/receptionist-management/edit/${data._id}`)}
      />
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
          {rowData.photo ? (
            <img
              src={rowData.photo}
              alt={rowData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <i className="pi pi-user text-gray-400 text-sm" />
          )}
        </div>

        <div>
          <p className="font-medium text-gray-800">{rowData.name}</p>
        </div>
      </div>
    );
  };

  const tableData =
    receptionistRes?.data?.map((item, index) => ({
      ...item,
      srNo: (page - 1) * limit + index + 1,
    })) || [];

  const columns = [
    {
      field: 'srNo',
      header: 'Sr. No.',
      sortable: false,
      minWidth: '80px'
    },
    {
      field: 'employeeId',
      header: 'Employee ID',
      sortable: true,
      minWidth: '140px'
    },
    {
      field: 'name',
      header: 'Data Entry Operator',
      sortable: true,
      body: nameBodyTemplate,
      minWidth: '280px'
    },
    {
      field: 'email',
      header: 'Email ID',
      sortable: true,
      minWidth: '300px'
    },
    {
      field: 'password',
      header: 'Password',
      sortable: true,
      minWidth: '200px'
    },
    {
      field: 'action',
      header: 'Actions',
      sortable: false,
      body: actionBodyTemplate,
      minWidth: '120px'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title="Data Entry Operator List"
        showSearchBar={true}
        searchValue={search}
        searchPlaceholder="Search by name or email"
        onSearch={setSearch}
        showAddButton={true}
        addButtonLabel="Add Data Entry Operator"
        onAdd={() => navigate('/receptionist-management/add')}
      />

      <DataTable
        data={tableData}
        columns={columns}
        loading={loading}
        emptyMessage="No data entry operators found."
      />

      <Pagination
        currentPage={receptionistRes?.pagination?.page}
        totalPages={receptionistRes?.pagination?.totalPages}
        totalItems={receptionistRes?.pagination?.total}
        itemsPerPage={receptionistRes?.pagination?.limit}
        showRowPerPage={true}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}