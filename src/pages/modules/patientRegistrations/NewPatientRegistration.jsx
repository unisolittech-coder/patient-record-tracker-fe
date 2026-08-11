import { useState, useEffect, useMemo, useCallback } from "react";
import BreadCrumb from "../../../components/common/BreadCrumb";
import Button from "../../../components/common/Button";
import {
  TextInput,
  SelectInput,
  DateInput,
} from "../../../components/common/FormFields";
import PagePath from "../../../components/common/PagePath";
// import FileUploadSection from './FileUploadSection';
import usePatientMgmt from "../../../hooks/patientMgmt/usePatientMgmt";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import RegFormFormate from "../../../helper/print/RegFormFormate";

const breadcrumbPaths = [
  { label: "Patient Registration", url: "/patient-registration" },
  { label: "New Patient" },
];

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const patientTypeOptions = [
  { label: "General / OPD", value: "General / OPD" },
  { label: "Emergency", value: "Emergency" },
  { label: "MLC (Medico-Legal Case)", value: "MLC (Medico-Legal Case)" },
  { label: "IPD / Admission", value: "IPD / Admission" },
  { label: "Referral", value: "Referral" },
  { label: "Follow-up", value: "Follow-up" },
  { label: "Pregnancy / Maternity", value: "Pregnancy / Maternity" },
  { label: "Pediatric", value: "Pediatric" },
  { label: "Day Care", value: "Day Care" },
];

const mlcTypeOptions = [
  { label: "No", value: "No" },
  { label: "Road Traffic Accident", value: "Road Traffic Accident" },
  { label: "Assault", value: "Assault" },
  { label: "Poisoning", value: "Poisoning" },
  { label: "Burn Injury", value: "Burn Injury" },
  { label: "Fall / Accident", value: "Fall / Accident" },
  { label: "Sexual Assault", value: "Sexual Assault" },
  { label: "Unidentified Patient", value: "Unidentified Patient" },
  { label: "Other", value: "Other" },
];

export default function NewPatientRegistration() {
  const { addPatient, loading, departmentsData, fetchDepartmentsDropdown } =
    usePatientMgmt();
  const [showPrintForm, setShowPrintForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch departments-management-dropdown API via hook
  useEffect(() => {
    fetchDepartmentsDropdown();
  }, []);

  const validationSchema = Yup.object({
    patientName: Yup.string().required("Patient Name is required"),
    gender: Yup.string().required("Gender is required"),
    age: Yup.string().required("Age is required"),
    mobileNumber: Yup.string()
      .required("Mobile Number is required")
      .matches(/^[0-9]{10}$/, "Enter valid mobile number"),
    referToDepartment: Yup.string().required("Department is required"),
    floor: Yup.string().required("Floor is required"),
    doctorName: Yup.string().required("Doctor is required"),
    roomNumber: Yup.string().required("Room Number is required"),
    patientType: Yup.string().required("Patient Type is required"),
    mlcType: Yup.string().required("MLC Type is required"),
    aadhaarNumber: Yup.string().matches(
      /^[0-9]{12}$/,
      "Enter valid Aadhaar Number",
    ),
    address: Yup.string().required("Patient Address is required"),
  });

  const formik = useFormik({
    initialValues: {
      patientId: "",
      patientName: "",
      gender: "",
      dateOfBirth: null,
      age: "",
      mobileNumber: "",
      referToDepartment: "",
      floor: "",
      doctorName: "",
      roomNumber: "",
      patientType: "",
      mlcType: "No",
      aadhaarNumber: "",
      address: "",
      operatorName: "",
      counterNumber: "",
      registrationDate: "",
      registrationTime: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        const requiredFields = [
          "patientName",
          "gender",
          "age",
          "mobileNumber",
          "referToDepartment",
          "floor",
          "doctorName",
          "roomNumber",
          "patientType",
          "mlcType",
          "address",
        ];

        const missingFields = requiredFields.filter(
          (field) => !values[field] || String(values[field]).trim() === "",
        );

        if (missingFields.length > 0) {
          toast.error(
            `Please fill all required fields: ${missingFields.join(", ")}`,
          );
          return;
        }

        const payload = {
          patientName: values.patientName,
          gender: values.gender,
          age: values.age,
          mobileNumber: values.mobileNumber,
          referToDepartment: values.referToDepartment,
          floorNumber: values.floor,
          doctorName: values.doctorName,
          roomNumber: values.roomNumber,
          patientType: values.patientType,
          mlcType: values.mlcType,
          aadhaarNumber: values.aadhaarNumber || undefined,
          address: values.address,
          operatorName: values.operatorName,
          counterNumber: values.counterNumber,
        };

        if (values.dateOfBirth) {
          payload.dateOfBirth = new Date(values.dateOfBirth).toISOString();
        }

        const response = await addPatient(payload);

        if (response?.data) {
          const {
            patientId,
            registrarName,
            counterNo,
            registrationDate,
            registrationTime,
          } = response.data;
          if (patientId) formik.setFieldValue("patientId", patientId);
          if (registrarName)
            formik.setFieldValue("operatorName", registrarName);
          if (counterNo)
            formik.setFieldValue("counterNumber", String(counterNo));
          if (registrationDate)
            formik.setFieldValue("registrationDate", registrationDate);
          if (registrationTime)
            formik.setFieldValue("registrationTime", registrationTime);
          setIsSaved(true);
        }
      } catch (error) {
        console.error("Patient registration error:", error);
        toast.error("Something went wrong while saving patient details");
      }
    },
  });

  const handlePrint = () => {
    setShowPrintForm(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setShowPrintForm(false);
      setIsSaved(false);
      formik.resetForm();
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, [formik]);

  // -----------------------------
  // Input restriction handlers
  // -----------------------------
  const handleNumericInput = useCallback(
    (fieldName, maxLength) => (e) => {
      const value = e.target.value;
      const sanitized = value.replace(/[^0-9]/g, "").slice(0, maxLength);
      formik.setFieldValue(fieldName, sanitized);
    },
    [formik],
  );

  const handleNumericKeyDown = useCallback((e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Enter",
    ];
    if (allowedKeys.includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return;
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  }, []);
  // -----------------------------
  // Department handlers
  // -----------------------------
  const departmentOptions = useMemo(() => {
    return departmentsData.map((item) => ({
      label: item.department,
      value: item.department,
    }));
  }, [departmentsData]);

  const handleDepartmentChange = useCallback(
    (selectedOption) => {
      const dept = departmentsData.find(
        (item) => item.department === selectedOption?.value,
      );
      formik.setFieldValue("referToDepartment", selectedOption?.value || "");
      formik.setFieldValue("floor", dept?.floorNo || "");
      formik.setFieldValue("doctorName", "");
      formik.setFieldValue("roomNumber", "");
    },
    [formik, departmentsData],
  );

  const selectedDepartment = useMemo(() => {
    return departmentsData.find(
      (item) => item.department === formik.values.referToDepartment,
    );
  }, [formik.values.referToDepartment, departmentsData]);

  const roomNumberOptions = useMemo(() => {
    if (!selectedDepartment) return [];
    return (selectedDepartment.roomNos || []).map((room) => ({
      label: `Room ${room}`,
      value: String(room),
    }));
  }, [selectedDepartment]);

  const doctorOptions = useMemo(() => {
    if (!selectedDepartment) return [];
    return (selectedDepartment.doctors || []).map((doc) => ({
      label: doc,
      value: doc,
    }));
  }, [selectedDepartment]);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />
      <PagePath title="Register New Patient" />

      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          {/* Basic Information */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div>
                <TextInput
                  id="patientName"
                  name="patientName"
                  label="Patient Name"
                  placeholder="Enter full name"
                  value={formik.values.patientName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSaved}
                  required
                  error={
                    formik.touched.patientName && formik.errors.patientName
                  }
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
                    genderOptions.find(
                      (option) => option.value === formik.values.gender,
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue("gender", selectedOption?.value || "")
                  }
                  onBlur={() => formik.setFieldTouched("gender", true)}
                  isDisabled={isSaved}
                  isSearchable={false}
                  required
                  error={formik.touched.gender && formik.errors.gender}
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
                  disabled={isSaved}
                  required
                  error={formik.touched.age && formik.errors.age}
                />
              </div>

              <div className="relative z-20">
                <DateInput
                  id="dateOfBirth"
                  name="dateOfBirth"
                  label="Date of Birth"
                  placeholder="Select DOB"
                  value={formik.values.dateOfBirth}
                  onChange={(date) => formik.setFieldValue("dateOfBirth", date)}
                  onBlur={() => formik.setFieldTouched("dateOfBirth", true)}
                  disabled={isSaved}
                />
              </div>

              <div>
                <TextInput
                  id="mobileNumber"
                  name="mobileNumber"
                  label="Mobile Number"
                  placeholder="Enter mobile number"
                  value={formik.values.mobileNumber}
                  onChange={handleNumericInput("mobileNumber", 10)}
                  onKeyDown={handleNumericKeyDown}
                  onBlur={formik.handleBlur}
                  disabled={isSaved}
                  required
                  error={
                    formik.touched.mobileNumber && formik.errors.mobileNumber
                  }
                />
              </div>

              <div>
                <TextInput
                  id="aadhaarNumber"
                  name="aadhaarNumber"
                  label="Aadhaar Number"
                  placeholder="Enter 12-digit Aadhaar"
                  value={formik.values.aadhaarNumber}
                  onChange={handleNumericInput("aadhaarNumber", 12)}
                  onKeyDown={handleNumericKeyDown}
                  onBlur={formik.handleBlur}
                  disabled={isSaved}
                  error={
                    formik.touched.aadhaarNumber && formik.errors.aadhaarNumber
                  }
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
                <TextInput
                  id="address"
                  name="address"
                  label="Patient Address"
                  placeholder="Enter patient address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSaved}
                  required
                  error={formik.touched.address && formik.errors.address}
                />
              </div>
            </div>
          </section>

          {/* Patient Type Information */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Patient Type Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative z-20">
                <SelectInput
                  id="patientType"
                  name="patientType"
                  label="Patient Type"
                  options={patientTypeOptions}
                  placeholder="Select Patient Type"
                  value={
                    patientTypeOptions.find(
                      (option) => option.value === formik.values.patientType,
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue(
                      "patientType",
                      selectedOption?.value || "",
                    )
                  }
                  onBlur={() => formik.setFieldTouched("patientType", true)}
                  isDisabled={isSaved}
                  isSearchable={false}
                  required
                  error={
                    formik.touched.patientType && formik.errors.patientType
                  }
                />
              </div>

              <div className="relative z-10">
                <SelectInput
                  id="mlcType"
                  name="mlcType"
                  label="MLC Type"
                  options={mlcTypeOptions}
                  placeholder="Select MLC Type"
                  value={
                    mlcTypeOptions.find(
                      (option) => option.value === formik.values.mlcType,
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue("mlcType", selectedOption?.value || "")
                  }
                  onBlur={() => formik.setFieldTouched("mlcType", true)}
                  isDisabled={isSaved}
                  isSearchable={false}
                  required
                  error={formik.touched.mlcType && formik.errors.mlcType}
                />
              </div>
            </div>
          </section>

          {/* Department Information */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Department Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative z-20">
                <SelectInput
                  id="referToDepartment"
                  name="referToDepartment"
                  label="Refer To Department"
                  options={departmentOptions}
                  placeholder="Select Department"
                  value={
                    departmentOptions.find(
                      (option) =>
                        option.value === formik.values.referToDepartment,
                    ) || null
                  }
                  onChange={handleDepartmentChange}
                  onBlur={() =>
                    formik.setFieldTouched("referToDepartment", true)
                  }
                  isDisabled={isSaved}
                  isSearchable={false}
                  required
                  error={
                    formik.touched.referToDepartment &&
                    formik.errors.referToDepartment
                  }
                />
              </div>

              <div>
                <TextInput
                  id="floor"
                  name="floor"
                  label="Floor"
                  placeholder="Auto-filled on select"
                  value={formik.values.floor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSaved}
                  required
                  error={formik.touched.floor && formik.errors.floor}
                />
              </div>

              <div className="relative z-10">
                <SelectInput
                  id="doctorName"
                  name="doctorName"
                  label="Doctor"
                  options={doctorOptions}
                  placeholder={
                    selectedDepartment
                      ? "Select Doctor"
                      : "Select Department First"
                  }
                  value={
                    doctorOptions.find(
                      (option) => option.value === formik.values.doctorName,
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue(
                      "doctorName",
                      selectedOption?.value || "",
                    )
                  }
                  onBlur={() => formik.setFieldTouched("doctorName", true)}
                  isDisabled={isSaved}
                  isSearchable={false}
                  required
                  error={formik.touched.doctorName && formik.errors.doctorName}
                />
              </div>

              <div className="relative z-10">
                <SelectInput
                  id="roomNumber"
                  name="roomNumber"
                  label="Room Number"
                  options={roomNumberOptions}
                  placeholder={
                    selectedDepartment
                      ? "Select Room"
                      : "Select Department First"
                  }
                  value={
                    roomNumberOptions.find(
                      (option) => option.value === formik.values.roomNumber,
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue(
                      "roomNumber",
                      selectedOption?.value || "",
                    )
                  }
                  onBlur={() => formik.setFieldTouched("roomNumber", true)}
                  isDisabled={isSaved}
                  isSearchable={false}
                  required
                  error={formik.touched.roomNumber && formik.errors.roomNumber}
                />
              </div>
            </div>
          </section>

          {/* Patient ID Generation */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Patient ID
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <TextInput
                  id="patientId"
                  name="patientId"
                  label="Patient ID"
                  placeholder="Auto-generated on Save"
                  value={formik.values.patientId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSaved}
                  readOnly
                />
              </div>

              <div>
                <TextInput
                  id="operatorName"
                  name="operatorName"
                  label="Operator Name"
                  placeholder="Auto-filled on Save"
                  value={formik.values.operatorName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSaved}
                  readOnly
                />
              </div>

              <div className="max-w-xs">
                <TextInput
                  id="counterNumber"
                  name="counterNumber"
                  label="Counter Number"
                  placeholder="Auto-filled on Save"
                  value={formik.values.counterNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSaved}
                  readOnly
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
              <i className="pi pi-info-circle" style={{ fontSize: "0.9rem" }} />
              Patient ID, Operator Name and Counter Number will be automatically
              generated when you click Save.
            </p>
          </section>

          <div className="flex justify-end gap-3 mt-8">
            {isSaved ? (
              <Button
                type="button"
                label="Print"
                variant="secondary"
                icon="pi pi-print"
                className="px-8"
                onClick={handlePrint}
              />
            ) : (
              <Button
                type="submit"
                label={loading ? "Saving..." : "Save"}
                variant="primary"
                icon="pi pi-save"
                className="px-8"
                disabled={loading}
              />
            )}
          </div>
        </div>
      </form>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .reg-print-form, .reg-print-form * {
            visibility: visible;
          }
          .reg-print-form {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Print Form */}
      {showPrintForm && <RegFormFormate values={formik.values} />}
    </div>
  );
}
