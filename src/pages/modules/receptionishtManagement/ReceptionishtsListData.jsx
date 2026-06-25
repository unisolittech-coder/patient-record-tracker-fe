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

  console.log("receptionistRes", receptionistRes);

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
      field: 'name',
      header: 'Data Entry Operator Name',
      sortable: true,
      minWidth: '250px'
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
      minWidth: '150px'
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
        emptyMessage="No receptionists found."
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
