import React, { useEffect, useState } from 'react';
import usePatientMgmt from '../../../hooks/patientMgmt/usePatientMgmt';
import { useParams } from 'react-router-dom';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';

const PatientDataView = () => {
    const { patientDetails, loading, fetchPatientDetails, resetPatientDetails, resendPatientReport } = usePatientMgmt();
    const { id } = useParams();
    const [activeMedicalIndex, setActiveMedicalIndex] = useState(0);

    const breadcrumbPaths = [
        { label: 'Patient Data' },
        { label: 'Patients List', url: '/patient-data' },
        { label: 'Patient Details' }
    ];

    useEffect(() => {
        if (id) {
            fetchPatientDetails(id);
        }
        // Cleanup on unmount
        return () => {
            if (resetPatientDetails) {
                resetPatientDetails();
            }
        };
    }, [id]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format date only (without time)
    const formatDateOnly = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get file name from URL
    const getFileName = (url) => {
        if (!url) return 'N/A';
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    // Get file type from URL
    const getFileType = (url) => {
        if (!url) return 'unknown';
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
            return 'image';
        } else if (['pdf'].includes(extension)) {
            return 'pdf';
        } else if (['doc', 'docx'].includes(extension)) {
            return 'word';
        } else if (['xls', 'xlsx'].includes(extension)) {
            return 'excel';
        }
        return 'unknown';
    };

    // Get file icon based on type
    const getFileIcon = (url) => {
        const type = getFileType(url);
        switch (type) {
            case 'image': return '🖼️';
            case 'pdf': return '📄';
            case 'word': return '📝';
            case 'excel': return '📊';
            default: return '📎';
        }
    };

    // Get label for report type
    const getReportLabel = (key) => {
        const labels = {
            bloodReport: 'Blood Report',
            labReport: 'Lab Report',
            xrayReport: 'X-Ray Report',
            prescription: 'Prescription',
            otherMedicalDocuments: 'Other Documents',
            operationNotes: 'Operation Notes'
        };
        return labels[key] || key.replace(/([A-Z])/g, ' $1').trim();
    };

    // Check if medical has reports
    const hasReports = (medical) => {
        if (!medical || !medical.reports) return false;
        if (medical.reports.length === 0) return false;

        // Check if any report has actual data
        return medical.reports.some(report => {
            return Object.values(report).some(value =>
                value && typeof value === 'string' && value.startsWith('http')
            );
        });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto pb-12">
                <BreadCrumb paths={breadcrumbPaths} />
                <PagePath title="Patient Details" />
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            </div>
        );
    }

    if (!patientDetails) {
        return (
            <div className="max-w-7xl mx-auto pb-12">
                <BreadCrumb paths={breadcrumbPaths} />
                <PagePath title="Patient Details" />
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-700">No patient data found</p>
                </div>
            </div>
        );
    }

    console.log("patientDetails", patientDetails);

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <BreadCrumb paths={breadcrumbPaths} />
            <PagePath title={`Patient Details - ${patientDetails.patientName || ''}`} />
            <div className="space-y-4">
                {/* Basic Information Section */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                        <span className="text-blue-500">👤</span> Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase font-semibold">Patient ID</label>
                            <p className="text-lg font-medium text-gray-800">{patientDetails.patientId || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase font-semibold">Patient Name</label>
                            <p className="text-lg font-medium text-gray-800">{patientDetails.patientName || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase font-semibold">Gender</label>
                            <p className="text-lg font-medium text-gray-800">{patientDetails.gender || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase font-semibold">Mobile Number</label>
                            <p className="text-lg font-medium text-gray-800">{patientDetails.mobileNumber || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase font-semibold">Aadhaar Number</label>
                            <p className="text-lg font-medium text-gray-800">{patientDetails.aadhaarNumber || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase font-semibold">UHID</label>
                            <p className="text-lg font-medium text-gray-800">{patientDetails.uhid || 'N/A'}</p>
                        </div>
                        {patientDetails.dateOfBirth && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="text-xs text-gray-500 uppercase font-semibold">Date of Birth</label>
                                <p className="text-lg font-medium text-gray-800">{formatDateOnly(patientDetails.dateOfBirth)}</p>
                            </div>
                        )}
                        {patientDetails.age && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="text-xs text-gray-500 uppercase font-semibold">Age</label>
                                <p className="text-lg font-medium text-gray-800">{patientDetails.age} years</p>
                            </div>
                        )}
                        {patientDetails.bloodGroup && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="text-xs text-gray-500 uppercase font-semibold">Blood Group</label>
                                <p className="text-lg font-medium text-gray-800">{patientDetails.bloodGroup}</p>
                            </div>
                        )}
                        {patientDetails.emailId && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="text-xs text-gray-500 uppercase font-semibold">Email ID</label>
                                <p className="text-lg font-medium text-gray-800">{patientDetails.emailId}</p>
                            </div>
                        )}
                        {patientDetails.secondaryContactName && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="text-xs text-gray-500 uppercase font-semibold">Secondary Contact</label>
                                <p className="text-lg font-medium text-gray-800">{patientDetails.secondaryContactName}</p>
                            </div>
                        )}
                        {patientDetails.secondaryContactMobile && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="text-xs text-gray-500 uppercase font-semibold">Secondary Mobile</label>
                                <p className="text-lg font-medium text-gray-800">{patientDetails.secondaryContactMobile}</p>
                            </div>
                        )}
                        {patientDetails.abhaNumber && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="text-xs text-gray-500 uppercase font-semibold">ABHA Number</label>
                                <p className="text-lg font-medium text-gray-800">{patientDetails.abhaNumber}</p>
                            </div>
                        )}
                    </div>

                    {/* Address Section */}
                    {(patientDetails.address || patientDetails.city || patientDetails.state || patientDetails.pinCode) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Address Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {patientDetails.address && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Address</label>
                                        <p className="text-sm text-gray-800">{patientDetails.address}</p>
                                    </div>
                                )}
                                {patientDetails.landMark && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Landmark</label>
                                        <p className="text-sm text-gray-800">{patientDetails.landMark}</p>
                                    </div>
                                )}
                                {patientDetails.city && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">City</label>
                                        <p className="text-sm text-gray-800">{patientDetails.city}</p>
                                    </div>
                                )}
                                {patientDetails.state && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">State</label>
                                        <p className="text-sm text-gray-800">{patientDetails.state}</p>
                                    </div>
                                )}
                                {patientDetails.pinCode && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">PIN Code</label>
                                        <p className="text-sm text-gray-800">{patientDetails.pinCode}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Family Information */}
                    {(patientDetails.fatherName || patientDetails.motherName) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Family Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {patientDetails.fatherName && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Father Name</label>
                                        <p className="text-sm text-gray-800">{patientDetails.fatherName}</p>
                                        {patientDetails.fatherAge && (
                                            <p className="text-xs text-gray-500">Age: {patientDetails.fatherAge} years</p>
                                        )}
                                    </div>
                                )}
                                {patientDetails.motherName && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Mother Name</label>
                                        <p className="text-sm text-gray-800">{patientDetails.motherName}</p>
                                        {patientDetails.motherAge && (
                                            <p className="text-xs text-gray-500">Age: {patientDetails.motherAge} years</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* Medical Information Section */}
                {patientDetails.medicalInformation && patientDetails.medicalInformation.length > 0 && (
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                            <span className="text-green-500">🏥</span> Medical Information
                        </h2>

                        {/* Medical Record Tabs */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {patientDetails.medicalInformation.map((item, index) => (
                                <div key={item._id} className="flex items-center gap-2">
                                    <button
                                        key={index}
                                        onClick={() => setActiveMedicalIndex(index)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeMedicalIndex === index
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Visit {index + 1}
                                        {item.dateOfVisit && (
                                            <span className="ml-1 text-xs opacity-75">
                                                ({formatDateOnly(item.dateOfVisit)})
                                            </span>
                                        )}
                                    </button>
                                    <Button
                                        label="Resend Report"
                                        type="button"
                                        variant="primary"
                                        onClick={() =>
                                            resendPatientReport(id, {
                                                medicalInformationId: item._id,
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Active Medical Record */}
                        {patientDetails.medicalInformation[activeMedicalIndex] && (
                            <div className="space-y-4">
                                {(() => {
                                    const medical = patientDetails.medicalInformation[activeMedicalIndex];
                                    return (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {medical.opdIpdNumber && (
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">OPD/IPD Number</label>
                                                        <p className="text-sm font-medium text-gray-800">{medical.opdIpdNumber}</p>
                                                    </div>
                                                )}
                                                {medical.doctorName && (
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Doctor Name</label>
                                                        <p className="text-sm font-medium text-gray-800">{medical.doctorName}</p>
                                                    </div>
                                                )}
                                                {medical.department && (
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Department</label>
                                                        <p className="text-sm font-medium text-gray-800">{medical.department}</p>
                                                    </div>
                                                )}
                                                {medical.diseaseDiagnosis && (
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Diagnosis</label>
                                                        <p className="text-sm font-medium text-gray-800">{medical.diseaseDiagnosis}</p>
                                                    </div>
                                                )}
                                                {medical.reportType && (
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Report Type</label>
                                                        <p className="text-sm font-medium text-gray-800">{medical.reportType}</p>
                                                    </div>
                                                )}
                                                {medical.dateOfVisit && (
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Date of Visit</label>
                                                        <p className="text-sm font-medium text-gray-800">{formatDateOnly(medical.dateOfVisit)}</p>
                                                    </div>
                                                )}
                                                {medical.admissionDate && (
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Admission Date</label>
                                                        <p className="text-sm font-medium text-gray-800">{formatDateOnly(medical.admissionDate)}</p>
                                                    </div>
                                                )}
                                                {medical.dischargeDate && (
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Discharge Date</label>
                                                        <p className="text-sm font-medium text-gray-800">{formatDateOnly(medical.dischargeDate)}</p>
                                                    </div>
                                                )}
                                                {medical.familyRemarks && (
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Family Remarks</label>
                                                        <p className="text-sm font-medium text-gray-800">{medical.familyRemarks}</p>
                                                    </div>
                                                )}
                                                {medical.medicalInfoSummary && (
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Summary</label>
                                                        <p className="text-sm font-medium text-gray-800">{medical.medicalInfoSummary}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Siblings Information */}
                                            {(medical.brothers?.length > 0 || medical.sisters?.length > 0) && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Siblings Information</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {medical.brothers && medical.brothers.length > 0 && (
                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                <label className="text-xs text-gray-500 uppercase font-semibold">Brothers</label>
                                                                <div className="mt-1 space-y-1">
                                                                    {medical.brothers.map((brother, idx) => (
                                                                        <p key={idx} className="text-sm text-gray-800">
                                                                            {brother.name} {brother.age && `(Age: ${brother.age})`}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {medical.sisters && medical.sisters.length > 0 && (
                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                <label className="text-xs text-gray-500 uppercase font-semibold">Sisters</label>
                                                                <div className="mt-1 space-y-1">
                                                                    {medical.sisters.map((sister, idx) => (
                                                                        <p key={idx} className="text-sm text-gray-800">
                                                                            {sister.name} {sister.age && `(Age: ${sister.age})`}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Reports Section */}
                                            {hasReports(medical) && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                        <span className="text-purple-500">📊</span> Reports & Documents
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {medical.reports.map((report, idx) => {
                                                            // Get all report entries with URLs
                                                            const reportEntries = Object.entries(report).filter(
                                                                ([key, value]) => value && typeof value === 'string' && value.startsWith('http')
                                                            );

                                                            return reportEntries.map(([reportType, url]) => (
                                                                <div key={`${idx}-${reportType}`} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-2xl">{getFileIcon(url)}</span>
                                                                            <div>
                                                                                <p className="text-sm font-medium text-gray-700">
                                                                                    {getReportLabel(reportType)}
                                                                                </p>
                                                                                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                                                                    {getFileName(url)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <a
                                                                                href={url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                                                            >
                                                                                View
                                                                            </a>
                                                                            <a
                                                                                href={url}
                                                                                download
                                                                                className="text-green-500 hover:text-green-700 text-sm font-medium"
                                                                            >
                                                                                Download
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                    {getFileType(url) === 'image' && (
                                                                        <div className="mt-2 border rounded overflow-hidden">
                                                                            <img
                                                                                src={url}
                                                                                alt={reportType}
                                                                                className="w-full h-24 object-cover"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    {getFileType(url) === 'pdf' && (
                                                                        <div className="mt-2 flex items-center justify-center bg-red-50 rounded p-2">
                                                                            <span className="text-red-500 text-sm">📄 PDF Document</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ));
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
};

export default PatientDataView;