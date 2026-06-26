import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import Button from "../../../components/common/Button";
import DisableFields from "../../../components/common/DisableFields";
import Loader from "../../../components/common/Loader";

import {
    TextInput,
    SelectInput,
    DateInput,
    FileInput,
    TextAreaInput
} from "../../../components/common/FormFields";

import usePatientMgmt from "../../../hooks/patientMgmt/usePatientMgmt";

const validationSchema = Yup.object({
    doctorName: Yup.string().required("Doctor Name is required"),
    opdIpdNumber: Yup.string().required("OPD/IPD Number is required"),
    dateOfVisit: Yup.string().required("Date of Visit is required"),
});

export default function PatientDataUpdate() {
    const {
        patientDetails,
        loading,
        fetchPatientDetails,
        resetPatientDetails,
        updatePatient
    } = usePatientMgmt();

    const { id } = useParams();
    const [showMedicalForm, setShowMedicalForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const fileInputRefs = useRef({});

    useEffect(() => {
        if (id) {
            fetchPatientDetails(id);
        }

        return () => {
            if (resetPatientDetails) {
                resetPatientDetails();
            }
        };
    }, [id]);

    const formik = useFormik({
        initialValues: {
            opdIpdNumber: "",
            uhid: "",
            doctorName: "",
            department: "",
            diseaseDiagnosis: "",
            reportType: "",
            dateOfVisit: "",
            admissionDate: "",
            dischargeDate: "",

            prescription: null,
            labReport: null,
            bloodReport: null,
            xrayReport: null,
            ctScanReport: null,
            mriReport: null,
            ultrasoundReport: null,
            ecgReport: null,
            dischargeSummary: null,
            otherMedicalDocuments: null,

            operationNotes: "",
            fatherName: "",
            fatherAge: "",
            motherName: "",
            motherAge: "",
            brothers: [{ name: "", age: "" }],
            sisters: [{ name: "", age: "" }],
            familyRemarks: "",
            medicalInfoSummary: ""
        },

        validationSchema,

        onSubmit: async (values, { resetForm, setFieldValue }) => {
            try {
                setIsSubmitting(true);

                const fileFields = ['prescription', 'labReport', 'bloodReport', 'xrayReport', 'ctScanReport',
                    'mriReport', 'ultrasoundReport', 'ecgReport', 'dischargeSummary', 'otherMedicalDocuments'];

                const hasFile = fileFields.some(key => {
                    const value = values[key];
                    return value instanceof File || (value && typeof value === 'object' && value.name);
                });

                if (!hasFile) {
                    toast.error("Please upload at least one document");
                    setIsSubmitting(false);
                    return;
                }

                const formData = new FormData();

                const textFields = [
                    'opdIpdNumber', 'uhid', 'doctorName', 'department', 'diseaseDiagnosis',
                    'reportType', 'dateOfVisit', 'admissionDate', 'dischargeDate', 'operationNotes',
                    'fatherName', 'fatherAge', 'motherName', 'motherAge', 'familyRemarks', 'medicalInfoSummary'
                ];

                textFields.forEach(key => {
                    const value = values[key];
                    if (value !== null && value !== undefined && value !== "") {
                        formData.append(key, value);
                    }
                });

                ['brothers', 'sisters'].forEach(siblingType => {
                    const siblings = values[siblingType] || [];
                    siblings.forEach((sibling, index) => {
                        if (sibling.name && sibling.name.trim()) {
                            formData.append(`${siblingType}[${index}][name]`, sibling.name);
                            formData.append(`${siblingType}[${index}][age]`, sibling.age || "");
                        }
                    });
                });

                fileFields.forEach(key => {
                    const value = values[key];
                    if (value instanceof File || (value && typeof value === 'object' && value.name)) {
                        formData.append(key, value);
                    }
                });

                if (updatePatient) {
                    await updatePatient(id, formData);
                } else {
                    toast.error("Update method not available");
                    setIsSubmitting(false);
                    return;
                }
                setIsFormSubmitted(true);
                resetForm();

                fileFields.forEach(key => {
                    setFieldValue(key, null);
                });

                setUploadedFiles({});

                setTimeout(() => {
                    const fileInputs = document.querySelectorAll('input[type="file"]');
                    fileInputs.forEach(input => {
                        if (input) {
                            input.value = '';
                        }
                    });
                }, 100);

                await fetchPatientDetails(id);

                setTimeout(() => {
                    setShowMedicalForm(false);
                    setIsFormSubmitted(false);
                }, 500);

            } catch (error) {
                console.error("Error:", error);
                toast.error(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong. Please try again."
                );
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    const handleFileChange = (fieldName) => (event) => {
        const file = event?.target?.files?.[0];

        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`File ${file.name} exceeds 10MB limit`);
                event.target.value = '';
                return;
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf',
                'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            if (!allowedTypes.includes(file.type)) {
                toast.error(`File ${file.name} type not supported`);
                event.target.value = '';
                return;
            }

            formik.setFieldValue(fieldName, file);
            setUploadedFiles(prev => ({
                ...prev,
                [fieldName]: file
            }));
            toast.success(`File ${file.name} uploaded successfully`);
        } else {
            formik.setFieldValue(fieldName, null);
            setUploadedFiles(prev => {
                const newState = { ...prev };
                delete newState[fieldName];
                return newState;
            });
        }
    };

    const handleSiblingChange = (type, index, field, value) => {
        const siblings = [...formik.values[type]];
        siblings[index][field] = value;
        formik.setFieldValue(type, siblings);
    };

    const addSibling = (type) => {
        const siblings = [...formik.values[type]];
        siblings.push({ name: "", age: "" });
        formik.setFieldValue(type, siblings);
    };

    const removeSibling = (type, index) => {
        const siblings = [...formik.values[type]];
        siblings.splice(index, 1);
        formik.setFieldValue(type, siblings);
    };

    // FIXED: Updated date handler to work with DateInput component
    const handleDateChange = (fieldName) => (dateValue) => {
        console.log(`Date change for ${fieldName}:`, dateValue);
        
        // If dateValue is null, undefined, or empty string
        if (!dateValue) {
            formik.setFieldValue(fieldName, '');
            return;
        }

        // If dateValue is a string
        if (typeof dateValue === 'string') {
            // Check if it's a valid date string
            const testDate = new Date(dateValue);
            if (!isNaN(testDate.getTime())) {
                formik.setFieldValue(fieldName, dateValue);
            } else {
                formik.setFieldValue(fieldName, '');
            }
            return;
        }

        // If dateValue is a Date object
        if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
            const year = dateValue.getFullYear();
            const month = String(dateValue.getMonth() + 1).padStart(2, '0');
            const day = String(dateValue.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            formik.setFieldValue(fieldName, formattedDate);
            return;
        }

        // If dateValue is an object with value property (common in some date pickers)
        if (dateValue && typeof dateValue === 'object' && dateValue.value) {
            const val = dateValue.value;
            if (typeof val === 'string') {
                const testDate = new Date(val);
                if (!isNaN(testDate.getTime())) {
                    formik.setFieldValue(fieldName, val);
                    return;
                }
            }
            if (val instanceof Date && !isNaN(val.getTime())) {
                const year = val.getFullYear();
                const month = String(val.getMonth() + 1).padStart(2, '0');
                const day = String(val.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                formik.setFieldValue(fieldName, formattedDate);
                return;
            }
        }

        // If dateValue has format method (moment.js or similar)
        if (dateValue && typeof dateValue === 'object' && typeof dateValue.format === 'function') {
            const formattedDate = dateValue.format('YYYY-MM-DD');
            formik.setFieldValue(fieldName, formattedDate);
            return;
        }

        // Fallback: try to convert to string
        try {
            const stringValue = String(dateValue);
            if (stringValue) {
                const testDate = new Date(stringValue);
                if (!isNaN(testDate.getTime())) {
                    formik.setFieldValue(fieldName, stringValue);
                    return;
                }
            }
        } catch (e) {
            console.warn('Date conversion failed:', e);
        }

        // If all else fails, set empty string
        formik.setFieldValue(fieldName, '');
    };

    const getFilePreview = (file) => {
        if (!file) return null;
        try {
            return URL.createObjectURL(file);
        } catch (error) {
            return null;
        }
    };

    const getFileIcon = (file) => {
        if (!file) return '📎';
        const type = file.type;
        if (type?.startsWith('image/')) return '🖼️';
        if (type === 'application/pdf') return '📄';
        if (type?.includes('word') || type?.includes('document')) return '📝';
        if (type?.includes('excel') || type?.includes('spreadsheet')) return '📊';
        return '📎';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const removeFile = (fieldName) => {
        formik.setFieldValue(fieldName, null);
        setUploadedFiles(prev => {
            const newState = { ...prev };
            delete newState[fieldName];
            return newState;
        });
        if (fileInputRefs.current[fieldName]) {
            fileInputRefs.current[fieldName].value = '';
        }
        toast.info(`File removed`);
    };

    const breadcrumbPaths = [
        { label: "Patient Data" },
        { label: "Patients List", url: "/patient-data" },
        { label: "Patient Data Update" }
    ];

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'N/A';
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto pb-12">
                <BreadCrumb paths={breadcrumbPaths} />
                <PagePath title="Patient Data Update" />
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
                <PagePath title="Patient Data Update" />
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-700">No patient data found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <BreadCrumb paths={breadcrumbPaths} />
            <PagePath title={`Patient Data Update - ${patientDetails.patientName || 'N/A'}`} />

            {/* Basic Details */}
            <div className="bg-white rounded-xl border p-6 mb-6">
                <div className="mb-5 border-b pb-3">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <span className="text-blue-500">👤</span> Patient Information
                    </h2>
                </div>

                <DisableFields disabled={true}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <TextInput label="Patient ID" value={patientDetails?.patientId || ""} />
                        <TextInput label="Patient Name" value={patientDetails?.patientName || ""} />
                        <TextInput label="Gender" value={patientDetails?.gender || ""} />
                        <TextInput label="Age" value={patientDetails?.age || ""} />
                        <TextInput label="Mobile Number" value={patientDetails?.mobileNumber || ""} />
                        <TextInput label="Alternate Mobile" value={patientDetails?.secondaryContactMobile || patientDetails?.alternateMobileNumber || ""} />
                        <TextInput label="Email" value={patientDetails?.emailId || ""} />
                        <TextInput label="Aadhaar Number" value={patientDetails?.aadhaarNumber || ""} />
                        <TextInput label="ABHA Number" value={patientDetails?.abhaNumber || ""} />
                        <TextInput label="City" value={patientDetails?.city || ""} />
                        <TextInput label="State" value={patientDetails?.state || ""} />
                        <TextInput label="Pin Code" value={patientDetails?.pinCode || ""} />
                        <div className="md:col-span-2 lg:col-span-4">
                            <TextAreaInput label="Address" value={patientDetails?.address || ""} rows={3} />
                        </div>
                        {patientDetails?.landMark && (
                            <div className="md:col-span-2 lg:col-span-4">
                                <TextInput label="Landmark" value={patientDetails?.landMark || ""} />
                            </div>
                        )}
                    </div>
                </DisableFields>
            </div>

            {/* Medical History */}
            <div className="bg-white rounded-xl border p-6 mb-6">
                <div className="flex justify-between items-center mb-5 border-b pb-3">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <span className="text-green-500">🏥</span> Previous Medical Records
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            ({patientDetails?.medicalInformation?.length || 0} records)
                        </span>
                    </h2>

                    <Button
                        label="Add More Medical Info"
                        icon="pi pi-plus"
                        variant="primary"
                        onClick={() => setShowMedicalForm(true)}
                        disabled={showMedicalForm || isFormSubmitted}
                    />
                </div>

                {patientDetails?.medicalInformation?.length > 0 ? (
                    patientDetails.medicalInformation.map((item, index) => (
                        <div key={item._id || index} className="border rounded-lg p-4 mb-4 bg-gray-50 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold text-gray-700">Medical Record #{index + 1}</h4>
                                {item.dateOfVisit && (
                                    <span className="text-sm text-gray-500">Visit Date: {formatDate(item.dateOfVisit)}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Doctor Name</label>
                                    <p className="text-sm font-medium text-gray-800">{item.doctorName || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">OPD/IPD</label>
                                    <p className="text-sm font-medium text-gray-800">{item.opdIpdNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">UHID</label>
                                    <p className="text-sm font-medium text-gray-800">{item.uhid || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Diagnosis</label>
                                    <p className="text-sm font-medium text-gray-800">{item.diseaseDiagnosis || 'N/A'}</p>
                                </div>
                                {item.department && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Department</label>
                                        <p className="text-sm font-medium text-gray-800">{item.department}</p>
                                    </div>
                                )}
                                {item.reportType && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Report Type</label>
                                        <p className="text-sm font-medium text-gray-800">{item.reportType}</p>
                                    </div>
                                )}
                                {item.admissionDate && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Admission Date</label>
                                        <p className="text-sm font-medium text-gray-800">{formatDate(item.admissionDate)}</p>
                                    </div>
                                )}
                                {item.dischargeDate && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Discharge Date</label>
                                        <p className="text-sm font-medium text-gray-800">{formatDate(item.dischargeDate)}</p>
                                    </div>
                                )}
                            </div>

                            {(item.fatherName || item.motherName) && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Family Information</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
                                        {item.fatherName && (
                                            <div>
                                                <p className="text-xs text-gray-500">Father</p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {item.fatherName} {item.fatherAge && `(Age: ${item.fatherAge})`}
                                                </p>
                                            </div>
                                        )}
                                        {item.motherName && (
                                            <div>
                                                <p className="text-xs text-gray-500">Mother</p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {item.motherName} {item.motherAge && `(Age: ${item.motherAge})`}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {(item.brothers?.length > 0 || item.sisters?.length > 0) && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Siblings</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                                        {item.brothers && item.brothers.length > 0 && (
                                            <div>
                                                <p className="text-xs text-gray-500">Brothers</p>
                                                {item.brothers.map((brother, idx) => (
                                                    <p key={idx} className="text-sm font-medium text-gray-800">
                                                        {brother.name} {brother.age && `(Age: ${brother.age})`}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                        {item.sisters && item.sisters.length > 0 && (
                                            <div>
                                                <p className="text-xs text-gray-500">Sisters</p>
                                                {item.sisters.map((sister, idx) => (
                                                    <p key={idx} className="text-sm font-medium text-gray-800">
                                                        {sister.name} {sister.age && `(Age: ${sister.age})`}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {(item.familyRemarks || item.medicalInfoSummary) && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {item.familyRemarks && (
                                            <div>
                                                <label className="text-xs text-gray-500 uppercase font-semibold">Family Remarks</label>
                                                <p className="text-sm text-gray-700">{item.familyRemarks}</p>
                                            </div>
                                        )}
                                        {item.medicalInfoSummary && (
                                            <div>
                                                <label className="text-xs text-gray-500 uppercase font-semibold">Medical Summary</label>
                                                <p className="text-sm text-gray-700">{item.medicalInfoSummary}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {item.reports && item.reports.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Reports</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {item.reports.map((report, idx) => {
                                            const reportEntries = Object.entries(report).filter(
                                                ([key, value]) => value && typeof value === 'string' && value.startsWith('http')
                                            );
                                            return reportEntries.map(([reportType, url]) => {
                                                const labels = {
                                                    bloodReport: 'Blood Report',
                                                    labReport: 'Lab Report',
                                                    xrayReport: 'X-Ray Report',
                                                    prescription: 'Prescription',
                                                    otherMedicalDocuments: 'Other Documents'
                                                };
                                                return (
                                                    <a
                                                        key={`${idx}-${reportType}`}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                                                    >
                                                        📎 {labels[reportType] || reportType.replace(/([A-Z])/g, ' $1').trim()}
                                                    </a>
                                                );
                                            });
                                        })}
                                    </div>
                                </div>
                            )}

                            {item.operationNotes && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Operation Notes</label>
                                    <p className="text-sm text-gray-700 mt-1">{item.operationNotes}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No medical records found for this patient.</p>
                        <p className="text-sm mt-1">Click "Add More Medical Info" to add a new record.</p>
                    </div>
                )}
            </div>

            {/* Add Medical Form */}
            {showMedicalForm && (
                <form onSubmit={formik.handleSubmit}>
                    <div className="bg-white rounded-xl border p-6">
                        <div className="mb-5 border-b pb-3 flex justify-between items-center">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <span className="text-purple-500">📝</span> Add New Medical Information
                            </h2>
                            <span className="text-sm text-red-500">* Required fields</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div>
                                <TextInput
                                    name="opdIpdNumber"
                                    label="OPD/IPD Number"
                                    placeholder="Enter OPD/IPD number"
                                    value={formik.values.opdIpdNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                />
                                {formik.touched.opdIpdNumber && formik.errors.opdIpdNumber && (
                                    <small className="text-red-500 block mt-1">{formik.errors.opdIpdNumber}</small>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    name="uhid"
                                    label="UHID"
                                    placeholder="Enter UHID"
                                    value={formik.values.uhid}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div>
                                <TextInput
                                    name="doctorName"
                                    label="Doctor Name"
                                    placeholder="Enter doctor name"
                                    value={formik.values.doctorName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                />
                                {formik.touched.doctorName && formik.errors.doctorName && (
                                    <small className="text-red-500 block mt-1">{formik.errors.doctorName}</small>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    name="department"
                                    label="Department"
                                    placeholder="Enter department"
                                    value={formik.values.department}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div>
                                <TextInput
                                    name="diseaseDiagnosis"
                                    label="Disease Diagnosis"
                                    placeholder="Enter diagnosis"
                                    value={formik.values.diseaseDiagnosis}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div>
                                <TextInput
                                    name="reportType"
                                    label="Report Type"
                                    placeholder="Enter report type"
                                    value={formik.values.reportType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {/* FIXED: Date Inputs with proper onChange handling */}
                            <div className="relative z-50">
                                <DateInput
                                    name="dateOfVisit"
                                    label="Date Of Visit"
                                    placeholder="Select visit date"
                                    value={formik.values.dateOfVisit}
                                    onChange={(e) => {
                                        console.log("DateOfVisit onChange:", e);
                                        // Handle both event and direct value
                                        const value = e?.target?.value || e?.value || e;
                                        handleDateChange('dateOfVisit')(value);
                                    }}
                                    required
                                />
                                {formik.touched.dateOfVisit && formik.errors.dateOfVisit && (
                                    <small className="text-red-500 block mt-1">{formik.errors.dateOfVisit}</small>
                                )}
                            </div>

                            <div className="relative z-40">
                                <DateInput
                                    name="admissionDate"
                                    label="Admission Date"
                                    placeholder="Select admission date"
                                    value={formik.values.admissionDate}
                                    onChange={(e) => {
                                        console.log("AdmissionDate onChange:", e);
                                        const value = e?.target?.value || e?.value || e;
                                        handleDateChange('admissionDate')(value);
                                    }}
                                />
                            </div>

                            <div className="relative z-30">
                                <DateInput
                                    name="dischargeDate"
                                    label="Discharge Date"
                                    placeholder="Select discharge date"
                                    value={formik.values.dischargeDate}
                                    onChange={(e) => {
                                        console.log("DischargeDate onChange:", e);
                                        const value = e?.target?.value || e?.value || e;
                                        handleDateChange('dischargeDate')(value);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Family Information */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <h3 className="font-semibold text-md mb-4 flex items-center gap-2">
                                <span className="text-indigo-500">👨‍👩‍👧‍👦</span> Family Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                <div>
                                    <TextInput
                                        name="fatherName"
                                        label="Father Name"
                                        placeholder="Enter father name"
                                        value={formik.values.fatherName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div>
                                    <TextInput
                                        name="fatherAge"
                                        label="Father Age"
                                        type="number"
                                        placeholder="Enter father age"
                                        value={formik.values.fatherAge}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div>
                                    <TextInput
                                        name="motherName"
                                        label="Mother Name"
                                        placeholder="Enter mother name"
                                        value={formik.values.motherName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div>
                                    <TextInput
                                        name="motherAge"
                                        label="Mother Age"
                                        type="number"
                                        placeholder="Enter mother age"
                                        value={formik.values.motherAge}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Siblings */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <h3 className="font-semibold text-md mb-4 flex items-center gap-2">
                                <span className="text-pink-500">👫</span> Siblings Information
                            </h3>

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700">Brothers</label>
                                    <Button
                                        type="button"
                                        label="Add Brother"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => addSibling('brothers')}
                                    />
                                </div>
                                {formik.values.brothers.map((brother, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-3 mb-2 items-end">
                                        <TextInput
                                            label={index === 0 ? "Name" : ""}
                                            placeholder="Enter brother name"
                                            value={brother.name}
                                            onChange={(e) => handleSiblingChange('brothers', index, 'name', e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <TextInput
                                                label={index === 0 ? "Age" : ""}
                                                type="number"
                                                placeholder="Age"
                                                value={brother.age}
                                                onChange={(e) => handleSiblingChange('brothers', index, 'age', e.target.value)}
                                            />
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSibling('brothers', index)}
                                                    className="text-red-500 hover:text-red-700 text-sm mt-1"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700">Sisters</label>
                                    <Button
                                        type="button"
                                        label="Add Sister"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => addSibling('sisters')}
                                    />
                                </div>
                                {formik.values.sisters.map((sister, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-3 mb-2 items-end">
                                        <TextInput
                                            label={index === 0 ? "Name" : ""}
                                            placeholder="Enter sister name"
                                            value={sister.name}
                                            onChange={(e) => handleSiblingChange('sisters', index, 'name', e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <TextInput
                                                label={index === 0 ? "Age" : ""}
                                                type="number"
                                                placeholder="Age"
                                                value={sister.age}
                                                onChange={(e) => handleSiblingChange('sisters', index, 'age', e.target.value)}
                                            />
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSibling('sisters', index)}
                                                    className="text-red-500 hover:text-red-700 text-sm mt-1"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reports */}
                        <div className="mt-8">
                            <h3 className="font-semibold text-md mb-4 flex items-center gap-2">
                                <span className="text-orange-500">📊</span> Report Upload Module
                                <span className="text-sm font-normal text-red-500 ml-2">* At least one document required</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {[
                                    { id: 'prescription', label: 'Prescription' },
                                    { id: 'labReport', label: 'Lab Report' },
                                    { id: 'bloodReport', label: 'Blood Report' },
                                    { id: 'xrayReport', label: 'X-Ray Report' },
                                    { id: 'ctScanReport', label: 'CT Scan Report' },
                                    { id: 'mriReport', label: 'MRI Report' },
                                    { id: 'ultrasoundReport', label: 'Ultrasound Report' },
                                    { id: 'ecgReport', label: 'ECG Report' },
                                    { id: 'dischargeSummary', label: 'Discharge Summary' },
                                ].map((file) => {
                                    const uploadedFile = uploadedFiles[file.id];
                                    const isUploaded = !!uploadedFile;

                                    return (
                                        <div key={file.id} className="border rounded-lg p-3 hover:border-blue-400 transition-colors">
                                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                                {file.label}
                                            </label>

                                            {!isUploaded ? (
                                                <input
                                                    type="file"
                                                    id={file.id}
                                                    name={file.id}
                                                    accept="image/*,.pdf,.doc,.docx"
                                                    onChange={handleFileChange(file.id)}
                                                    ref={(el) => fileInputRefs.current[file.id] = el}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                                />
                                            ) : (
                                                <div className="bg-gray-50 rounded-lg p-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 truncate flex-1">
                                                            <span className="text-xl">{getFileIcon(uploadedFile)}</span>
                                                            <span className="text-sm text-gray-700 truncate" title={uploadedFile.name}>
                                                                {uploadedFile.name}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(file.id)}
                                                            className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <span className="text-xs text-gray-500">
                                                            {formatFileSize(uploadedFile.size)}
                                                        </span>
                                                        {uploadedFile.type?.startsWith('image/') && (
                                                            <span className="text-xs text-green-500">✓ Image</span>
                                                        )}
                                                        {uploadedFile.type === 'application/pdf' && (
                                                            <span className="text-xs text-red-500">✓ PDF</span>
                                                        )}
                                                    </div>
                                                    {uploadedFile.type?.startsWith('image/') && (
                                                        <div className="mt-2 border rounded overflow-hidden">
                                                            <img
                                                                src={getFilePreview(uploadedFile)}
                                                                alt={uploadedFile.name}
                                                                className="w-full h-20 object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    {uploadedFile.type === 'application/pdf' && (
                                                        <div className="mt-2 flex items-center justify-center bg-red-50 rounded p-2">
                                                            <span className="text-red-500 text-sm">📄 PDF Document</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 border-t border-dashed border-gray-200 pt-4">
                                <div className="border rounded-lg p-4">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Other Medical Documents
                                    </label>

                                    {!uploadedFiles.otherMedicalDocuments ? (
                                        <input
                                            type="file"
                                            id="otherMedicalDocuments"
                                            name="otherMedicalDocuments"
                                            accept="image/*,.pdf,.doc,.docx"
                                            onChange={handleFileChange('otherMedicalDocuments')}
                                            ref={(el) => fileInputRefs.current['otherMedicalDocuments'] = el}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                        />
                                    ) : (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 truncate flex-1">
                                                    <span className="text-xl">{getFileIcon(uploadedFiles.otherMedicalDocuments)}</span>
                                                    <span className="text-sm text-gray-700 truncate" title={uploadedFiles.otherMedicalDocuments.name}>
                                                        {uploadedFiles.otherMedicalDocuments.name}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile('otherMedicalDocuments')}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {formatFileSize(uploadedFiles.otherMedicalDocuments.size)}
                                                </span>
                                                {uploadedFiles.otherMedicalDocuments.type?.startsWith('image/') && (
                                                    <span className="text-xs text-green-500">✓ Image</span>
                                                )}
                                                {uploadedFiles.otherMedicalDocuments.type === 'application/pdf' && (
                                                    <span className="text-xs text-red-500">✓ PDF</span>
                                                )}
                                            </div>
                                            {uploadedFiles.otherMedicalDocuments.type?.startsWith('image/') && (
                                                <div className="mt-2 border rounded overflow-hidden">
                                                    <img
                                                        src={getFilePreview(uploadedFiles.otherMedicalDocuments)}
                                                        alt={uploadedFiles.otherMedicalDocuments.name}
                                                        className="w-full h-20 object-cover"
                                                    />
                                                </div>
                                            )}
                                            {uploadedFiles.otherMedicalDocuments.type === 'application/pdf' && (
                                                <div className="mt-2 flex items-center justify-center bg-red-50 rounded p-2">
                                                    <span className="text-red-500 text-sm">📄 PDF Document</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <TextAreaInput
                                        label="Family Remarks"
                                        name="familyRemarks"
                                        placeholder="Enter family remarks..."
                                        rows={3}
                                        value={formik.values.familyRemarks}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div>
                                    <TextAreaInput
                                        label="Medical Info Summary"
                                        name="medicalInfoSummary"
                                        placeholder="Enter medical summary..."
                                        rows={3}
                                        value={formik.values.medicalInfoSummary}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <TextAreaInput
                                    label="Operation Notes"
                                    name="operationNotes"
                                    placeholder="Enter operation notes..."
                                    rows={4}
                                    value={formik.values.operationNotes}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                label="Cancel"
                                variant="secondary"
                                onClick={() => {
                                    setShowMedicalForm(false);
                                    formik.resetForm();
                                    setUploadedFiles({});
                                    setIsFormSubmitted(false);
                                }}
                            />

                            <Button
                                type="submit"
                                label={isSubmitting ? "Saving..." : "Save Medical Information"}
                                icon="pi pi-save"
                                variant="primary"
                                disabled={isSubmitting || loading}
                            />
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}