import React from 'react';
import BreadCrumb from '../../../components/common/BreadCrumb';
import Button from '../../../components/common/Button';
import { TextInput, SelectInput, DateInput, TextAreaInput } from '../../../components/common/FormFields';
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

  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => ({ label: bg, value: bg }));

  const departmentOptions = [
    { label: 'Cardiology', value: 'Cardiology' },
    { label: 'Neurology', value: 'Neurology' },
    { label: 'Orthopedics', value: 'Orthopedics' },
    { label: 'General Medicine', value: 'General Medicine' }
  ];

  const validationSchema = Yup.object({
    patientId: Yup.string().required("Patient ID is required"),
    patientName: Yup.string().required("Patient Name is required"),
    gender: Yup.string().required("Gender is required"),
    mobileNumber: Yup.string()
      .required("Mobile Number is required")
      .matches(/^[0-9]{10}$/, "Enter valid mobile number"),
    aadhaarNumber: Yup.string()
      .required("Aadhaar Number is required")
      .matches(/^[0-9]{12}$/, "Enter valid Aadhaar Number"),
  });

  const formik = useFormik({
    initialValues: {
      // Basic Information
      patientId: "",
      patientName: "",
      gender: "",
      dateOfBirth: "",
      age: "",
      bloodGroup: "",
      mobileNumber: "",
      alternateMobileNumber: "",
      emailId: "",
      aadhaarNumber: "",
      abhaNumber: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      
      // Medical Information
      opdIpdNumber: "",
      uhid: "",
      doctorName: "",
      department: "",
      diseaseDiagnosis: "",
      reportType: "",
      dateOfVisit: "",
      admissionDate: "",
      dischargeDate: "",
      
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
      operationNotes: ""
    },

    validationSchema,

    onSubmit: async (values, { resetForm, setFieldValue }) => {
        // Check required fields
        const requiredFields = ['patientId', 'patientName', 'gender', 'mobileNumber', 'aadhaarNumber'];
        const missingFields = requiredFields.filter(field => !values[field] || values[field].trim() === '');
        
        if (missingFields.length > 0) {
          toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
          return;
        }

        // Check if at least one file is uploaded
        const fileFields = ['prescription', 'labReport', 'bloodReport', 'xrayReport', 'ctScanReport', 
          'mriReport', 'ultrasoundReport', 'ecgReport', 'dischargeSummary', 'otherMedicalDocuments'];
        
        const hasFile = fileFields.some(key => {
          const value = values[key];
          return value instanceof File || (value && typeof value === 'object' && value.name);
        });

        if (!hasFile) {
          toast.error("Please upload at least one document");
          return;
        }

        const formData = new FormData();

        // Append all text fields
        const textFields = [
          'patientId', 'patientName', 'gender', 'dateOfBirth', 'age', 'bloodGroup',
          'mobileNumber', 'alternateMobileNumber', 'emailId', 'aadhaarNumber', 
          'abhaNumber', 'address', 'city', 'state', 'pinCode',
          'opdIpdNumber', 'uhid', 'doctorName', 'department', 'diseaseDiagnosis',
          'reportType', 'dateOfVisit', 'admissionDate', 'dischargeDate', 'operationNotes'
        ];

        textFields.forEach(key => {
          const value = values[key];
          if (value !== null && value !== undefined && value !== "") {
            formData.append(key, value);
          }
        });

        // Append all file fields
        fileFields.forEach(key => {
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
          fileFields.forEach(key => {
            setFieldValue(key, null);
          });
          setTimeout(() => {
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => {
              if (input) {
                input.value = '';
              }
            });
          }, 100);
        }
    }
  });

  // Handle file change
  const handleFileChange = (fieldName, file) => {
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 10MB limit`);
        return false;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} type not supported. Please upload image, PDF, or Word document.`);
        return false;
      }
      
      formik.setFieldValue(fieldName, file);
      return true;
    } else {
      formik.setFieldValue(fieldName, null);
      return false;
    }
  };

  // Remove file
  const handleRemoveFile = (fieldName) => {
    formik.setFieldValue(fieldName, null);
  };

  // Handle form submit with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if form is valid
    const errors = formik.errors;
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    
    // Manually trigger submit
    formik.submitForm();
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />
      <PagePath title="Register New Patient" />
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Basic Information Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div>
                <TextInput 
                  id="patientId" 
                  name="patientId"
                  label="Patient ID" 
                  placeholder="Enter Patient ID" 
                  value={formik.values.patientId || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.patientId && formik.errors.patientId && (
                  <small className="text-red-500 block mt-1">{formik.errors.patientId}</small>
                )}
              </div>
              
              <div>
                <TextInput 
                  id="patientName" 
                  name="patientName" 
                  label="Patient Name" 
                  placeholder="Enter full name" 
                  value={formik.values.patientName || ''} 
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur} 
                  required
                />
                {formik.touched.patientName && formik.errors.patientName && (
                  <small className="text-red-500 block mt-1">{formik.errors.patientName}</small>
                )}
              </div>
              
              <div className="relative z-20">
                <SelectInput 
                  id="gender" 
                  name="gender" 
                  label="Gender" 
                  options={genderOptions} 
                  placeholder="Select Gender" 
                  value={formik.values.gender || ''} 
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur} 
                  required
                />
                {formik.touched.gender && formik.errors.gender && (
                  <small className="text-red-500 block mt-1">{formik.errors.gender}</small>
                )}
              </div>
              
              <div>
                <DateInput 
                  id="dateOfBirth" 
                  name="dateOfBirth" 
                  label="Date of Birth" 
                  placeholder="Select DOB" 
                  value={formik.values.dateOfBirth || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              
              <div>
                <TextInput 
                  id="age" 
                  name="age" 
                  label="Age" 
                  placeholder="Enter age" 
                  type="number"
                  value={formik.values.age || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              
              <div className="relative z-10">
                <SelectInput 
                  id="bloodGroup" 
                  name="bloodGroup" 
                  label="Blood Group" 
                  options={bloodGroupOptions} 
                  placeholder="Select BG"
                  value={formik.values.bloodGroup || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              
              <div>
                <TextInput 
                  id="mobileNumber" 
                  name="mobileNumber" 
                  label="Mobile Number" 
                  placeholder="Enter mobile" 
                  value={formik.values.mobileNumber || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required 
                />
                {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                  <small className="text-red-500 block mt-1">{formik.errors.mobileNumber}</small>
                )}
              </div>
              
              <div>
                <TextInput 
                  id="alternateMobileNumber" 
                  name="alternateMobileNumber" 
                  label="Alternate Mobile" 
                  placeholder="Enter alternate mobile"
                  value={formik.values.alternateMobileNumber || ''}
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
                  value={formik.values.emailId || ''}
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
                  value={formik.values.aadhaarNumber || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.aadhaarNumber && formik.errors.aadhaarNumber && (
                  <small className="text-red-500 block mt-1">{formik.errors.aadhaarNumber}</small>
                )}
              </div>
              
              <div>
                <TextInput 
                  id="abhaNumber" 
                  name="abhaNumber" 
                  label="ABHA Number" 
                  placeholder="Enter ABHA number"
                  value={formik.values.abhaNumber || ''}
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
                  value={formik.values.address || ''}
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
                  value={formik.values.city || ''}
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
                  value={formik.values.state || ''}
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
                  value={formik.values.pinCode || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </section>

          {/* Medical Information Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <TextInput 
                  id="opdIpdNumber" 
                  name="opdIpdNumber" 
                  label="OPD/IPD Number" 
                  placeholder="Enter OPD/IPD number"
                  value={formik.values.opdIpdNumber || ''}
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
                  value={formik.values.uhid || ''}
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
                  value={formik.values.doctorName || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              
              <div className="relative z-10">
                <SelectInput 
                  id="department" 
                  name="department" 
                  label="Department" 
                  options={departmentOptions} 
                  placeholder="Select Department"
                  value={formik.values.department || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              
              <div>
                <TextInput 
                  id="diseaseDiagnosis" 
                  name="diseaseDiagnosis" 
                  label="Disease / Diagnosis" 
                  placeholder="Enter primary diagnosis"
                  value={formik.values.diseaseDiagnosis || ''}
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
                  value={formik.values.reportType || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              
              <div>
                <DateInput 
                  id="dateOfVisit" 
                  name="dateOfVisit" 
                  label="Date of Visit" 
                  placeholder="Select visit date"
                  value={formik.values.dateOfVisit || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              
              <div>
                <DateInput 
                  id="admissionDate" 
                  name="admissionDate" 
                  label="Admission Date" 
                  placeholder="If Applicable"
                  value={formik.values.admissionDate || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              
              <div>
                <DateInput 
                  id="dischargeDate" 
                  name="dischargeDate"
                  label="Discharge Date" 
                  placeholder="If Applicable"
                  value={formik.values.dischargeDate || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </section>

          {/* File Upload Section */}
          <FileUploadSection 
            formik={formik}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
          />

          <div className="flex justify-end gap-3 mt-8">
            <Button 
              type="submit"
              label={loading ? "Saving..." : "Save Registration"} 
              variant="primary" 
              icon="pi pi-save" 
              className="px-8"
              disabled={loading || false}
            />
          </div>
        </div>
      </form>
    </div>
  );
}