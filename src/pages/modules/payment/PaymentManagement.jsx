import { useState, useEffect } from 'react';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import usePayment from '../../../hooks/payment/usePayment';
import useDebounce from '../../../hooks/debounce/useDebounce';

export default function PaymentManagement() {
  const { paymentCollectorPatient, loading, fetchPaymentCollectorPatients, markPaymentDone } = usePayment();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);

  useEffect(() => {
    fetchPaymentCollectorPatients(debouncedSearch);
  }, [debouncedSearch]);

  const openPaymentModal = (patient) => {
    setSelectedPatient(patient);
    setSelectedTests(patient.tests?.filter(t => t.paymentStatus === 'unpaid').map(t => t.testName) || []);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPatient) return;
    const success = await markPaymentDone(selectedPatient.patientId, selectedTests);
    if (success) {
      setShowPaymentModal(false);
      fetchPaymentCollectorPatients(debouncedSearch);
    }
  };

  const toggleTest = (testName) => {
    setSelectedTests(prev => 
      prev.includes(testName) ? prev.filter(t => t !== testName) : [...prev, testName]
    );
  };

  const breadcrumbPaths = [
    { label: 'Payment Management', url: '/payment-management' },
    { label: 'Payment Collection' }
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

      {loading && (
        <div className="flex items-center justify-center py-12">
          <i className="pi pi-spin pi-spinner text-3xl text-blue-600" />
        </div>
      )}

      {!loading && paymentCollectorPatient?.data?.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <i className="pi pi-inbox text-5xl text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No patients found matching your search criteria.</p>
        </div>
      )}

      {!loading && paymentCollectorPatient?.data?.length > 0 && (
        <div className="space-y-6">
          {paymentCollectorPatient.data.map((patient) => {
            const hasUnpaid = patient.tests?.some(t => t.paymentStatus === 'unpaid');
            const reg = patient.registration || {};

            return (
              <div key={patient._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-800">{patient.patientName}</h3>
                        <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          {patient.patientId}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Payment Collection Details</p>
                    </div>

                    {hasUnpaid && (
                      <button
                        onClick={() => openPaymentModal(patient)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 text-sm font-medium w-fit"
                      >
                        Mark Payment Done
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <i className="pi pi-id-card text-blue-500" />
                      Registration Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Department</p>
                        <p className="text-sm font-medium text-gray-800">{reg.referToDepartment || '-'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Room Number</p>
                        <p className="text-sm font-medium text-gray-800">{reg.roomNumber || '-'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Doctor Name</p>
                        <p className="text-sm font-medium text-gray-800">{reg.doctorName || '-'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Floor Number</p>
                        <p className="text-sm font-medium text-gray-800">{reg.floorNumber || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <i className="pi pi-list text-green-500" />
                      Tests & Payment Status
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {patient.tests?.map((test) => (
                        <div
                          key={test._id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            test.paymentStatus === 'paid'
                              ? 'bg-green-50 border-green-100'
                              : 'bg-red-50 border-red-100'
                          }`}
                        >
                          <div>
                            <span className="text-sm font-medium text-gray-700 block">{test.testName}</span>
                            <span className="text-xs text-gray-500">₹{test.price || 0}</span>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            test.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {test.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Mark Payment Done</h3>
              <p className="text-sm text-gray-500">
                Patient: {selectedPatient?.patientName} ({selectedPatient?.patientId})
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {selectedPatient?.tests?.map((test) => {
                  const isSelected = selectedTests.includes(test.testName);
                  return (
                    <label key={test._id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={test.paymentStatus === 'paid' || isSelected}
                        disabled={test.paymentStatus === 'paid'}
                        onChange={() => toggleTest(test.testName)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className={`text-sm flex-1 ${test.paymentStatus === 'paid' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {test.testName}
                      </span>
                      <span className="text-sm font-medium text-gray-700">₹{test.price || 0}</span>
                      {test.paymentStatus === 'paid' && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Paid</span>
                      )}
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total</span>
                  <span className="text-lg font-bold text-blue-600">
                    ₹{selectedTests.reduce((total, testName) => {
                      const test = selectedPatient?.tests?.find(t => t.testName === testName);
                      return total + (test?.price || 0);
                    }, 0)}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={loading || selectedTests.length === 0}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                {loading ? 'Processing...' : 'Payment Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}