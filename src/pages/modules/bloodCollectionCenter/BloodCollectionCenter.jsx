import { useState, useEffect } from 'react';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import useBloodCC from '../../../hooks/bloodCollectionCenter/useBloodCC';
import useDebounce from '../../../hooks/debounce/useDebounce';
import BloodCollectionPrintForm from '../../../helper/print/BloodCollectionPrintForm';

export default function BloodCollectionCenter() {
    const { fetchBloodTest, loading, bloodTest } = useBloodCC();
    const [search, setSearch] = useState('');
    const [showPrintForm, setShowPrintForm] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const debouncedSearch = useDebounce(search, 500);

    const breadcrumbPaths = [
        { label: 'Blood Collection Center', url: '/blood-collection-center' },
        { label: 'Tests List' }
    ];

    useEffect(() => {
        fetchBloodTest(debouncedSearch);
    }, [debouncedSearch]);

    const handlePrint = (patient, test) => {
        const now = new Date();

        const pad = (n) => String(n).padStart(2, '0');

        const day = pad(now.getDate());
        const month = pad(now.getMonth() + 1);
        const year = String(now.getFullYear()).slice(-2);
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());

        const dateTime = `${day}/${month}/${year}, ${hours}:${minutes}`;

        const printData = {
            uniqueId: patient.uniqueId || '-',
            patientName: patient.patientName || '-',
            testName: test.testName || '-',
            dateTime,
        };

        setSelectedTest(printData);
        setShowPrintForm(true);

        setTimeout(() => {
            window.print();
        }, 100);
    };

    useEffect(() => {
        const handleAfterPrint = () => {
            setShowPrintForm(false);
            setSelectedTest(null);
        };
        window.addEventListener("afterprint", handleAfterPrint);
        return () => window.removeEventListener("afterprint", handleAfterPrint);
    }, []);

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <BreadCrumb paths={breadcrumbPaths} />

            <PagePath
                title="Blood Collection Center"
                showSearchBar={true}
                searchValue={search}
                searchPlaceholder="Search by Patient ID..."
                onSearch={setSearch}
            />

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <i className="pi pi-spin pi-spinner text-3xl text-blue-600" />
                </div>
            )}

            {!loading && bloodTest?.data?.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                    <i className="pi pi-inbox text-5xl text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">No blood tests found matching your search criteria.</p>
                </div>
            )}

            {!loading && bloodTest?.data?.length > 0 && (
                <div className="space-y-6">
                    {bloodTest.data.map((patient) => {
                        const reg = patient.registration || {};

                        return (
                            <div key={patient._id || patient.patientId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h3 className="text-lg font-bold text-gray-800">{patient.patientName}</h3>
                                                <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                                                    {patient.patientId}
                                                </span>
                                                {patient.uniqueId && (
                                                    <span className="text-xs font-mono text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                                                        UID: {patient.uniqueId}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">Blood Collection Details</p>
                                        </div>

                                        <span
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold w-fit ${patient.paymentStatus === 'paid'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}
                                        >
                                            {patient.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <i className="pi pi-id-card text-blue-500" />
                                            Registration Info
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">Department</p>
                                                <p className="text-sm font-medium text-gray-800">{reg.referToDepartment || '-'}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">Doctor Name</p>
                                                <p className="text-sm font-medium text-gray-800">{reg.doctorName || '-'}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">Room Number</p>
                                                <p className="text-sm font-medium text-gray-800">{reg.roomNumber || '-'}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">Floor Number</p>
                                                <p className="text-sm font-medium text-gray-800">{reg.floorNumber || '-'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <i className="pi pi-heart text-red-500" />
                                            Tests
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {patient.tests?.map((test) => (
                                                <div
                                                    key={test._id}
                                                    className={`flex items-center justify-between p-3 rounded-lg border ${test.paymentStatus === 'paid'
                                                        ? 'bg-green-50 border-green-100'
                                                        : 'bg-amber-50 border-amber-100'
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium text-gray-700">{test.testName}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${test.paymentStatus === 'paid'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {test.paymentStatus || 'pending'}
                                                        </span>
                                                        {test.paymentStatus === 'paid' && (
                                                            <button
                                                                onClick={() => handlePrint(patient, test)}
                                                                title="Print"
                                                                className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-lg hover:bg-blue-50"
                                                            >
                                                                <i className="pi pi-print text-sm" />
                                                            </button>
                                                        )}
                                                    </div>
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

            {showPrintForm && (
                <BloodCollectionPrintForm printData={selectedTest} />
            )}

            {/* Print Styles */}
            <style>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body * {
            visibility: hidden;
          }
          .blood-print-form, .blood-print-form * {
            visibility: visible;
          }
          .blood-print-form {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
        }
      `}</style>
        </div>
    );
}
