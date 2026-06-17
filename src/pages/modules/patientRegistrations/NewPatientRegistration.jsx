import React, { useState } from 'react';
import BreadCrumb from '../../../components/common/BreadCrumb';
import Button from '../../../components/common/Button';
import { TextInput, SelectInput, DateInput, FileInput, TextAreaInput } from '../../../components/common/FormFields';

import PagePath from '../../../components/common/PagePath';

export default function NewPatientRegistration() {
  const [formData, setFormData] = useState({});

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

  const handleSave = () => {
    console.log('Form Saved:', formData);
    // Submit logic goes here
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />
      <PagePath title="Register New Patient" />

      <div className="space-y-4">
        {/* Basic Information Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <TextInput id="patientId" label="Patient ID" placeholder="Auto Generated" disabled />
            <TextInput id="patientName" label="Patient Name" placeholder="Enter full name" required />
            <SelectInput id="gender" label="Gender" options={genderOptions} placeholder="Select Gender" required />
            <DateInput id="dob" label="Date of Birth" placeholder="Select DOB" required />
            <TextInput id="age" label="Age" placeholder="Enter age" type="number" />
            <SelectInput id="bloodGroup" label="Blood Group" options={bloodGroupOptions} placeholder="Select BG" />
            <TextInput id="mobileNumber" label="Mobile Number" placeholder="Enter mobile" required />
            <TextInput id="altMobileNumber" label="Alternate Mobile" placeholder="Enter alternate mobile" />
            <TextInput id="email" label="Email ID" placeholder="Optional" type="email" />
            <TextInput id="aadhaar" label="Aadhaar Number" placeholder="Enter 12-digit Aadhaar" />
            <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
              <TextInput id="address" label="Address" placeholder="Enter complete address" />
            </div>
            <TextInput id="city" label="City" placeholder="Enter city" />
            <TextInput id="state" label="State" placeholder="Enter state" />
            <TextInput id="pincode" label="PIN Code" placeholder="Enter PIN code" />
          </div>
        </section>

        {/* Medical Information Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Medical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TextInput id="opdIpdNumber" label="OPD/IPD Number" placeholder="Enter OPD/IPD number" required />
            <TextInput id="uhid" label="UHID" placeholder="Unique Hospital ID" />
            <TextInput id="doctorName" label="Doctor Name" placeholder="Assigned Doctor" required />
            <SelectInput id="department" label="Department" options={departmentOptions} placeholder="Select Department" required />
            <TextInput id="disease" label="Disease / Diagnosis" placeholder="Enter primary diagnosis" />
            <TextInput id="reportType" label="Report Type" placeholder="Enter report type" />
            <DateInput id="dateOfVisit" label="Date of Visit" placeholder="Select visit date" required />
            <DateInput id="admissionDate" label="Admission Date" placeholder="If Applicable" />
            <DateInput id="dischargeDate" label="Discharge Date" placeholder="If Applicable" />
          </div>
        </section>

        {/* Report Upload Module Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-4 pb-2 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Report Upload Module</h2>
            <p className="text-sm text-gray-500 mt-1">Upload relevant medical documents (Max size 10MB per file).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FileInput id="prescription" label="Prescription" accept="image/*,.pdf" />
            <FileInput id="labReports" label="Lab Reports" accept="image/*,.pdf" />
            <FileInput id="bloodReports" label="Blood Reports" accept="image/*,.pdf" />
            <FileInput id="xrayReports" label="X-Ray Reports" accept="image/*,.pdf" />
            <FileInput id="ctScanReports" label="CT Scan Reports" accept="image/*,.pdf" />
            <FileInput id="mriReports" label="MRI Reports" accept="image/*,.pdf" />
            <FileInput id="ultrasoundReports" label="Ultrasound Reports" accept="image/*,.pdf" />
            <FileInput id="ecgReports" label="ECG Reports" accept="image/*,.pdf" />
            <FileInput id="dischargeSummary" label="Discharge Summary" accept="image/*,.pdf" />
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <TextAreaInput id="operationNotes" label="Operation Notes (Optional)" placeholder="Type any operation or procedure notes here..." rows={4} />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 border-t border-dashed border-gray-200 pt-4 mt-2">
              <FileInput id="otherDocs" label="Other Medical Documents" accept="image/*,.pdf" />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 mt-8">
          <Button label="Save Registration" variant="primary" icon="pi pi-save" onClick={handleSave} className="px-8" />
        </div>
      </div>
    </div>
  );
}
