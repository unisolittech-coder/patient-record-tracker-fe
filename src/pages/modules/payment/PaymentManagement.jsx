import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import usePayment from '../../../hooks/payment/usePayment';
import useDebounce from '../../../hooks/debounce/useDebounce';

export default function PaymentManagement() {
  const { paymentCollectorPatient, loading, fetchPaymentCollectorPatients, updatePaymentCollectionStatus } = usePayment();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const breadcrumbPaths = [
    { label: 'Payment Management', url: '/payment-management' },
    { label: 'Payment Collection' }
  ];

  useEffect(() => {
    fetchPaymentCollectorPatients(debouncedSearch);
  }, [debouncedSearch]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleStatusUpdate = async (testId, currentStatus) => {
    if (currentStatus === 'paid') return;
    const success = await updatePaymentCollectionStatus(testId, { paymentStatus: 'paid' });
    if (success) {
      fetchPaymentCollectorPatients(debouncedSearch);
    }
  };

  const testsBodyTemplate = (rowData) => {
    return (
      <div className="flex flex-col gap-1">
        {rowData.tests?.map((test) => (
          <div key={test._id} className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-700">{test.testName}</span>
            <button
              onClick={() => handleStatusUpdate(test._id, test.paymentStatus)}
              disabled={test.paymentStatus === 'paid'}
              className={`text-xs px-2.5 py-1 rounded-lg transition-all duration-200 ${
                test.paymentStatus === 'paid'
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer'
              }`}
            >
              {test.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
            </button>
          </div>
        ))}
      </div>
    );
  };

  const registrationBodyTemplate = (rowData) => {
    const reg = rowData.registration || {};
    return (
      <div className="flex flex-col gap-1.5 text-sm">
        <div className="flex items-center gap-2">
          <i className="pi pi-building text-blue-500 text-xs" />
          <span className="text-slate-600">Dept: <span className="font-medium text-slate-800">{reg.referToDepartment || '-'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <i className="pi pi-map-marker text-purple-500 text-xs" />
          <span className="text-slate-600">Room: <span className="font-medium text-slate-800">{reg.roomNumber || '-'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <i className="pi pi-user-md text-green-500 text-xs" />
          <span className="text-slate-600">Dr: <span className="font-medium text-slate-800">{reg.doctorName || '-'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <i className="pi pi-th-large text-orange-500 text-xs" />
          <span className="text-slate-600">Floor: <span className="font-medium text-slate-800">{reg.floorNumber || '-'}</span></span>
        </div>
      </div>
    );
  };

  const tableData =
    paymentCollectorPatient?.data?.map((item, index) => ({
      ...item,
      srNo: (page - 1) * limit + index + 1,
    })) || [];

  const totalItems = paymentCollectorPatient?.pagination?.total || 0;
  const totalPages = paymentCollectorPatient?.pagination?.totalPages || 0;

  const columns = [
    {
      field: 'srNo',
      header: 'Sr. No.',
      sortable: false,
      minWidth: '60px'
    },
    {
      field: 'patientId',
      header: 'Patient ID',
      sortable: true,
      minWidth: '100px'
    },
    {
      field: 'patientName',
      header: 'Patient Name',
      sortable: true,
      minWidth: '150px'
    },
    {
      field: 'registration',
      header: 'Registration Details',
      sortable: false,
      body: registrationBodyTemplate,
      minWidth: '250px'
    },
    {
      field: 'tests',
      header: 'Tests & Payment Status',
      sortable: false,
      body: testsBodyTemplate,
      minWidth: '300px'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title="Payment Management"
        showSearchBar={true}
        searchValue={search}
        searchPlaceholder="Search by patient ID..."
        onSearch={setSearch}
      />

      <DataTable
        data={tableData}
        columns={columns}
        loading={loading}
        emptyMessage="No patients found matching your search criteria."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={limit}
        showRowPerPage={true}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
