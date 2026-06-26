import React from 'react';
import BreadCrumb from '../../../components/common/BreadCrumb';
import Button from '../../../components/common/Button';
import {
  TextInput,
  SelectInput,
  DateInput,
  TextAreaInput
} from '../../../components/common/FormFields';
import PagePath from '../../../components/common/PagePath';
import FileUploadSection from './FileUploadSection';
import usePatientMgmt from '../../../hooks/patientMgmt/usePatientMgmt';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

export default function NewPatientRegistration() {
  const { addPatient, loading } = usePatientMgmt();

  const breadcrumbPaths = [
    { label: 'Patient Registration', url: '/patient-registration' },
    { label: 'New Patient' }
  ];

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  const bloodGroupOptions = [
    'A+',
    'A-',
    'B+',
    'B-',
    'O+',
    'O-',
    'AB+',
    'AB-'
  ].map((bg) => ({ label: bg, value: bg }));

  const departmentOptions = [
    { label: 'Cardiology', value: 'Cardiology' },
    { label: 'Neurology', value: 'Neurology' },
    { label: 'Orthopedics', value: 'Orthopedics' },
    { label: 'General Medicine', value: 'General Medicine' }
  ];

  const validationSchema = Yup.object({
    patientId: Yup.string().required('Patient ID is required'),
    patientName: Yup.string().required('Patient Name is required'),
    gender: Yup.string().required('Gender is required'),
    mobileNumber: Yup.string()
      .required('Mobile Number is required')
      .matches(/^[0-9]{10}$/, 'Enter valid mobile number'),
    aadhaarNumber: Yup.string()
      .required('Aadhaar Number is required')
      .matches(/^[0-9]{12}$/, 'Enter valid Aadhaar Number'),
    secondaryContactMobile: Yup.string()
      .nullable()
      .test(
        'secondary-mobile',
        'Enter valid secondary mobile number',
        (value) => !value || /^[0-9]{10}$/.test(value)
      ),
    pinCode: Yup.string()
      .nullable()
      .test('pinCode', 'Enter valid PIN code', (value) => !value || /^[0-9]{6}$/.test(value))
  });

  const formik = useFormik({
    initialValues: {
      // Basic Information
      patientId: '',
      patientName: '',
      gender: '',
      dateOfBirth: null,
      age: '',
      bloodGroup: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      emailId: '',
      aadhaarNumber: '',
      abhaNumber: '',
      address: '',
      city: '',
      state: '',
      pinCode: '',
      secondaryContactName: '',
      secondaryContactMobile: '',
      landMark: '',

      // Medical Information
      opdIpdNumber: '',
      uhid: '',
      doctorName: '',
      department: '',
      diseaseDiagnosis: '',
      reportType: '',
      dateOfVisit: null,
      admissionDate: null,
      dischargeDate: null,
      medicalInfoSummary: '',
      reportsRemarks: '',

      // Family History
      motherName: '',
      motherAge: '',
      fatherName: '',
      fatherAge: '',
      familyRemarks: '',
      brothers: [],
      sisters: [],

      // Files
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

      // Notes
      operationNotes: ''
    },

    validationSchema,

    onSubmit: async (values, { resetForm, setFieldValue }) => {
      try {
        const requiredFields = [
          'patientId',
          'patientName',
          'gender',
          'mobileNumber',
          'aadhaarNumber'
        ];

        const missingFields = requiredFields.filter(
          (field) => !values[field] || String(values[field]).trim() === ''
        );

        if (missingFields.length > 0) {
          toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
          return;
        }

        const fileFields = [
          'prescription',
          'labReport',
          'bloodReport',
          'xrayReport',
          'ctScanReport',
          'mriReport',
          'ultrasoundReport',
          'ecgReport',
          'dischargeSummary',
          'otherMedicalDocuments'
        ];

        const hasFile = fileFields.some((key) => {
          const value = values[key];
          return value instanceof File || (value && typeof value === 'object' && value.name);
        });

        if (!hasFile) {
          toast.error('Please upload at least one document');
          return;
        }

        const formData = new FormData();

        const textFields = [
          // Basic
          'patientId',
          'patientName',
          'gender',
          'age',
          'bloodGroup',
          'mobileNumber',
          'alternateMobileNumber',
          'emailId',
          'aadhaarNumber',
          'abhaNumber',
          'address',
          'city',
          'state',
          'pinCode',
          'secondaryContactName',
          'secondaryContactMobile',
          'landMark',

          // Medical
          'opdIpdNumber',
          'uhid',
          'doctorName',
          'department',
          'diseaseDiagnosis',
          'reportType',
          'medicalInfoSummary',
          // 'reportsRemarks',

          // Family
          'motherName',
          'motherAge',
          'fatherName',
          'fatherAge',
          'familyRemarks',

          // Notes
          'operationNotes'
        ];

        textFields.forEach((key) => {
          const value = values[key];
          if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
          }
        });

        // Dates
        if (values.dateOfBirth) {
          formData.append('dateOfBirth', new Date(values.dateOfBirth).toISOString());
        }
        if (values.dateOfVisit) {
          formData.append('dateOfVisit', new Date(values.dateOfVisit).toISOString());
        }
        if (values.admissionDate) {
          formData.append('admissionDate', new Date(values.admissionDate).toISOString());
        }
        if (values.dischargeDate) {
          formData.append('dischargeDate', new Date(values.dischargeDate).toISOString());
        }

        // Family arrays
        formData.append('brothers', JSON.stringify(values.brothers || []));
        formData.append('sisters', JSON.stringify(values.sisters || []));

        // Files
        fileFields.forEach((key) => {
          const value = values[key];
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value && typeof value === 'object' && value.name) {
            formData.append(key, value);
          }
        });

        const success = await addPatient(formData);

        if (success) {
          resetForm();

          fileFields.forEach((key) => {
            setFieldValue(key, null);
          });

          setTimeout(() => {
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach((input) => {
              if (input) input.value = '';
            });
          }, 100);
        }
      } catch (error) {
        console.error('Patient registration error:', error);
        toast.error('Something went wrong while saving patient details');
      }
    }
  });

  // -----------------------------
  // File handlers
  // -----------------------------
  const handleFileChange = (fieldName, file) => {
    if (!file) {
      formik.setFieldValue(fieldName, null);
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(`File ${file.name} exceeds 10MB limit`);
      return false;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `File ${file.name} type not supported. Please upload image, PDF, or Word document.`
      );
      return false;
    }

    formik.setFieldValue(fieldName, file);
    return true;
  };

  const handleRemoveFile = (fieldName) => {
    formik.setFieldValue(fieldName, null);
  };

  // -----------------------------
  // Family handlers
  // -----------------------------
  const addBrother = () => {
    const brothers = formik.values.brothers || [];
    formik.setFieldValue('brothers', [...brothers, { name: '', age: '' }]);
  };

  const removeBrother = (index) => {
    const brothers = [...(formik.values.brothers || [])];
    brothers.splice(index, 1);
    formik.setFieldValue('brothers', brothers);
  };

  const addSister = () => {
    const sisters = formik.values.sisters || [];
    formik.setFieldValue('sisters', [...sisters, { name: '', age: '' }]);
  };

  const removeSister = (index) => {
    const sisters = [...(formik.values.sisters || [])];
    sisters.splice(index, 1);
    formik.setFieldValue('sisters', sisters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = await formik.validateForm();

    console.log("Formik Errors:", errors);
    console.log("Formik Values:", formik.values);

    if (Object.keys(errors).length > 0) {
      // Touch every field that has an error
      const touchedFields = {};

      const setNestedTouched = (obj, target) => {
        Object.keys(obj).forEach((key) => {
          if (
            obj[key] !== null &&
            typeof obj[key] === "object" &&
            !Array.isArray(obj[key])
          ) {
            target[key] = {};
            setNestedTouched(obj[key], target[key]);
          } else {
            target[key] = true;
          }
        });
      };

      setNestedTouched(errors, touchedFields);

      formik.setTouched(touchedFields, true);

      toast.error(
        `Validation Failed:\n${Object.entries(errors)
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join("\n")}`
      );

      return;
    }

    formik.handleSubmit();
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />
      <PagePath title="Register New Patient" />

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Basic Information */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div>
                <TextInput
                  id="patientId"
                  name="patientId"
                  label="Patient ID"
                  placeholder="Enter Patient ID"
                  value={formik.values.patientId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  error={formik.touched.patientId && formik.errors.patientId}
                />
              </div>

              <div>
                <TextInput
                  id="patientName"
                  name="patientName"
                  label="Patient Name"
                  placeholder="Enter full name"
                  value={formik.values.patientName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  error={formik.touched.patientName && formik.errors.patientName}
                />
              </div>

              <div className="relative z-30">
                <SelectInput
                  id="gender"
                  name="gender"
                  label="Gender"
                  options={genderOptions}
                  placeholder="Select Gender"
                  value={
                    genderOptions.find((option) => option.value === formik.values.gender) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue('gender', selectedOption?.value || '')
                  }
                  onBlur={() => formik.setFieldTouched('gender', true)}
                  required
                  error={formik.touched.gender && formik.errors.gender}
                />
              </div>

              <div className="relative z-20">
                <DateInput
                  id="dateOfBirth"
                  name="dateOfBirth"
                  label="Date of Birth"
                  placeholder="Select DOB"
                  value={formik.values.dateOfBirth}
                  onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
                  onBlur={() => formik.setFieldTouched('dateOfBirth', true)}
                />
              </div>

              <div>
                <TextInput
                  id="age"
                  name="age"
                  label="Age"
                  placeholder="Enter age"
                  type="number"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="relative z-20">
                <SelectInput
                  id="bloodGroup"
                  name="bloodGroup"
                  label="Blood Group"
                  options={bloodGroupOptions}
                  placeholder="Select Blood Group"
                  value={
                    bloodGroupOptions.find(
                      (option) => option.value === formik.values.bloodGroup
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue('bloodGroup', selectedOption?.value || '')
                  }
                  onBlur={() => formik.setFieldTouched('bloodGroup', true)}
                />
              </div>

              <div>
                <TextInput
                  id="mobileNumber"
                  name="mobileNumber"
                  label="Mobile Number"
                  placeholder="Enter mobile number"
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  error={formik.touched.mobileNumber && formik.errors.mobileNumber}
                />
              </div>

              <div>
                <TextInput
                  id="alternateMobileNumber"
                  name="alternateMobileNumber"
                  label="Alternate Mobile"
                  placeholder="Enter alternate mobile"
                  value={formik.values.alternateMobileNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <TextInput
                  id="emailId"
                  name="emailId"
                  label="Email ID"
                  placeholder="Enter email"
                  type="email"
                  value={formik.values.emailId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <TextInput
                  id="aadhaarNumber"
                  name="aadhaarNumber"
                  label="Aadhaar Number"
                  placeholder="Enter 12-digit Aadhaar"
                  value={formik.values.aadhaarNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  error={formik.touched.aadhaarNumber && formik.errors.aadhaarNumber}
                />
              </div>

              <div>
                <TextInput
                  id="abhaNumber"
                  name="abhaNumber"
                  label="ABHA Number"
                  placeholder="Enter ABHA number"
                  value={formik.values.abhaNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
                <TextInput
                  id="address"
                  name="address"
                  label="Address"
                  placeholder="Enter complete address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <TextInput
                  id="city"
                  name="city"
                  label="City"
                  placeholder="Enter city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <TextInput
                  id="state"
                  name="state"
                  label="State"
                  placeholder="Enter state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <TextInput
                  id="pinCode"
                  name="pinCode"
                  label="PIN Code"
                  placeholder="Enter PIN code"
                  value={formik.values.pinCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pinCode && formik.errors.pinCode}
                />
              </div>

              <div>
                <TextInput
                  id="secondaryContactName"
                  name="secondaryContactName"
                  label="Secondary Contact Name"
                  placeholder="Enter secondary contact name"
                  value={formik.values.secondaryContactName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <TextInput
                  id="secondaryContactMobile"
                  name="secondaryContactMobile"
                  label="Secondary Contact Mobile"
                  placeholder="Enter secondary contact mobile"
                  value={formik.values.secondaryContactMobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.secondaryContactMobile &&
                    formik.errors.secondaryContactMobile
                  }
                />
              </div>

              <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
                <TextInput
                  id="landMark"
                  name="landMark"
                  label="Landmark"
                  placeholder="Enter landmark"
                  value={formik.values.landMark}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </section>

          {/* Medical Information */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Medical Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <TextInput
                  id="opdIpdNumber"
                  name="opdIpdNumber"
                  label="OPD/IPD Number"
                  placeholder="Enter OPD/IPD number"
                  value={formik.values.opdIpdNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <TextInput
                  id="uhid"
                  name="uhid"
                  label="UHID"
                  placeholder="Unique Hospital ID"
                  value={formik.values.uhid}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <TextInput
                  id="doctorName"
                  name="doctorName"
                  label="Doctor Name"
                  placeholder="Assigned Doctor"
                  value={formik.values.doctorName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="relative z-20">
                <SelectInput
                  id="department"
                  name="department"
                  label="Department"
                  options={departmentOptions}
                  placeholder="Select Department"
                  value={
                    departmentOptions.find(
                      (option) => option.value === formik.values.department
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue('department', selectedOption?.value || '')
                  }
                  onBlur={() => formik.setFieldTouched('department', true)}
                />
              </div>

              <div>
                <TextInput
                  id="diseaseDiagnosis"
                  name="diseaseDiagnosis"
                  label="Disease / Diagnosis"
                  placeholder="Enter primary diagnosis"
                  value={formik.values.diseaseDiagnosis}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <TextInput
                  id="reportType"
                  name="reportType"
                  label="Report Type"
                  placeholder="Enter report type"
                  value={formik.values.reportType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="relative z-10">
                <DateInput
                  id="dateOfVisit"
                  name="dateOfVisit"
                  label="Date of Visit"
                  placeholder="Select visit date"
                  value={formik.values.dateOfVisit}
                  onChange={(date) => formik.setFieldValue('dateOfVisit', date)}
                  onBlur={() => formik.setFieldTouched('dateOfVisit', true)}
                />
              </div>

              <div className="relative z-10">
                <DateInput
                  id="admissionDate"
                  name="admissionDate"
                  label="Admission Date"
                  placeholder="If Applicable"
                  value={formik.values.admissionDate}
                  onChange={(date) => formik.setFieldValue('admissionDate', date)}
                  onBlur={() => formik.setFieldTouched('admissionDate', true)}
                />
              </div>

              <div className="relative z-10">
                <DateInput
                  id="dischargeDate"
                  name="dischargeDate"
                  label="Discharge Date"
                  placeholder="If Applicable"
                  value={formik.values.dischargeDate}
                  onChange={(date) => formik.setFieldValue('dischargeDate', date)}
                  onBlur={() => formik.setFieldTouched('dischargeDate', true)}
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <TextAreaInput
                  id="medicalInfoSummary"
                  name="medicalInfoSummary"
                  label="Medical Info Summary"
                  placeholder="Enter summary of patient medical information"
                  rows={4}
                  value={formik.values.medicalInfoSummary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </section>

          {/* Family History */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Family History
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <TextInput
                  id="motherName"
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
                  id="motherAge"
                  name="motherAge"
                  label="Mother Age"
                  placeholder="Enter mother age"
                  type="number"
                  value={formik.values.motherAge}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <TextInput
                  id="fatherName"
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
                  id="fatherAge"
                  name="fatherAge"
                  label="Father Age"
                  placeholder="Enter father age"
                  type="number"
                  value={formik.values.fatherAge}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <TextAreaInput
                  id="familyRemarks"
                  name="familyRemarks"
                  label="Family Remarks"
                  placeholder="Enter family history / remarks"
                  rows={3}
                  value={formik.values.familyRemarks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            {/* Brothers */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-800">Brothers</h3>
                <button
                  type="button"
                  onClick={addBrother}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  + Add Brother
                </button>
              </div>

              {(formik.values.brothers || []).length === 0 ? (
                <p className="text-sm text-gray-500">No brothers added.</p>
              ) : (
                <div className="space-y-4">
                  {(formik.values.brothers || []).map((brother, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4"
                    >
                      <TextInput
                        id={`brothers.${index}.name`}
                        name={`brothers.${index}.name`}
                        label="Brother Name"
                        placeholder="Enter brother name"
                        value={brother?.name || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      <TextInput
                        id={`brothers.${index}.age`}
                        name={`brothers.${index}.age`}
                        label="Brother Age"
                        placeholder="Enter age"
                        type="number"
                        value={brother?.age || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeBrother(index)}
                          className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sisters */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-800">Sisters</h3>
                <button
                  type="button"
                  onClick={addSister}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  + Add Sister
                </button>
              </div>

              {(formik.values.sisters || []).length === 0 ? (
                <p className="text-sm text-gray-500">No sisters added.</p>
              ) : (
                <div className="space-y-4">
                  {(formik.values.sisters || []).map((sister, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4"
                    >
                      <TextInput
                        id={`sisters.${index}.name`}
                        name={`sisters.${index}.name`}
                        label="Sister Name"
                        placeholder="Enter sister name"
                        value={sister?.name || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      <TextInput
                        id={`sisters.${index}.age`}
                        name={`sisters.${index}.age`}
                        label="Sister Age"
                        placeholder="Enter age"
                        type="number"
                        value={sister?.age || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeSister(index)}
                          className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* File Upload */}
          <FileUploadSection
            formik={formik}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
          />

          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="submit"
              label={loading ? 'Saving...' : 'Save'}
              variant="primary"
              icon="pi pi-save"
              className="px-8"
              disabled={loading}
            />
          </div>
        </div>
      </form>
    </div>
  );
}