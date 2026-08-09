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

const departmentOptions = [
  {
    label: "General Medicine",
    value: "General Medicine",
    roomStart: 1,
    roomEnd: 5,
    floor: "Ground Floor",
    doctors: [
      "Dr. A. Sharma",
      "Dr. B. Patil",
      "Dr. C. Deshmukh",
      "Dr. D. Gupta",
      "Dr. E. Joshi",
    ],
  },
  {
    label: "General Surgery",
    value: "General Surgery",
    roomStart: 6,
    roomEnd: 10,
    floor: "Ground Floor",
    doctors: [
      "Dr. F. Kulkarni",
      "Dr. G. Rao",
      "Dr. H. Mehra",
      "Dr. I. Nair",
      "Dr. J. Singh",
    ],
  },
  {
    label: "Pediatrics / Child Medicine",
    value: "Pediatrics / Child Medicine",
    roomStart: 11,
    roomEnd: 15,
    floor: "1st Floor",
    doctors: [
      "Dr. K. Verma",
      "Dr. L. Bose",
      "Dr. M. Chakra",
      "Dr. N. Das",
      "Dr. O. Pillai",
    ],
  },
  {
    label: "Obstetrics & Gynaecology (OBGY)",
    value: "Obstetrics & Gynaecology (OBGY)",
    roomStart: 16,
    roomEnd: 20,
    floor: "1st Floor",
    doctors: [
      "Dr. P. Menon",
      "Dr. Q. Iyer",
      "Dr. R. Khanna",
      "Dr. S. Bhat",
      "Dr. T. Reddy",
    ],
  },
  {
    label: "Orthopedics",
    value: "Orthopedics",
    roomStart: 21,
    roomEnd: 25,
    floor: "2nd Floor",
    doctors: [
      "Dr. U. Saxena",
      "Dr. V. Trivedi",
      "Dr. W. Kaur",
      "Dr. X. Malhotra",
      "Dr. Y. Pandey",
    ],
  },
  {
    label: "ENT (Ear, Nose & Throat)",
    value: "ENT (Ear, Nose & Throat)",
    roomStart: 26,
    roomEnd: 30,
    floor: "2nd Floor",
    doctors: [
      "Dr. Z. Agarwal",
      "Dr. AA. Bansal",
      "Dr. AB. Chawla",
      "Dr. AC. Dube",
      "Dr. AD. Eknath",
    ],
  },
  {
    label: "Ophthalmology / Eye",
    value: "Ophthalmology / Eye",
    roomStart: 31,
    roomEnd: 35,
    floor: "3rd Floor",
    doctors: [
      "Dr. AE. Fadnavis",
      "Dr. AF. Gokhale",
      "Dr. AG. Hegde",
      "Dr. AH. Inamdar",
      "Dr. AI. Jain",
    ],
  },
  {
    label: "Dermatology / Skin & VD",
    value: "Dermatology / Skin & VD",
    roomStart: 36,
    roomEnd: 40,
    floor: "3rd Floor",
    doctors: [
      "Dr. AJ. Kapoor",
      "Dr. AK. Lakhani",
      "Dr. AL. Mishra",
      "Dr. AM. Nadkarni",
      "Dr. AN. Oak",
    ],
  },
  {
    label: "Psychiatry / Mental Health",
    value: "Psychiatry / Mental Health",
    roomStart: 41,
    roomEnd: 45,
    floor: "3rd Floor",
    doctors: [
      "Dr. AO. Parikh",
      "Dr. AP. Qureshi",
      "Dr. AQ. Rane",
      "Dr. AR. Somani",
      "Dr. AS. Talwar",
    ],
  },
  {
    label: "Respiratory Medicine / Chest & TB",
    value: "Respiratory Medicine / Chest & TB",
    roomStart: 46,
    roomEnd: 50,
    floor: "4th Floor",
    doctors: [
      "Dr. AT. Uppal",
      "Dr. AU. Vaidya",
      "Dr. AV. Wagle",
      "Dr. AW. Yadav",
      "Dr. AX. Zope",
    ],
  },
  {
    label: "Cardiology",
    value: "Cardiology",
    roomStart: 51,
    roomEnd: 55,
    floor: "4th Floor",
    doctors: [
      "Dr. AY. Anand",
      "Dr. AZ. Bhide",
      "Dr. BA. Chopra",
      "Dr. BB. Dandekar",
      "Dr. BC. Erande",
    ],
  },
  {
    label: "Neurology",
    value: "Neurology",
    roomStart: 56,
    roomEnd: 60,
    floor: "4th Floor",
    doctors: [
      "Dr. BD. Furtado",
      "Dr. BE. Gade",
      "Dr. BF. Haldar",
      "Dr. BG. Irani",
      "Dr. BH. Joglekar",
    ],
  },
  {
    label: "Nephrology",
    value: "Nephrology",
    roomStart: 61,
    roomEnd: 65,
    floor: "5th Floor",
    doctors: [
      "Dr. BI. Kulkarni",
      "Dr. BJ. Lobo",
      "Dr. BK. Mankad",
      "Dr. BL. Nair",
      "Dr. BM. Oza",
    ],
  },
  {
    label: "Urology",
    value: "Urology",
    roomStart: 66,
    roomEnd: 70,
    floor: "5th Floor",
    doctors: [
      "Dr. BN. Pradhan",
      "Dr. BO. Qazi",
      "Dr. BP. Rathod",
      "Dr. BQ. Sane",
      "Dr. BR. Tendulkar",
    ],
  },
  {
    label: "Gastroenterology",
    value: "Gastroenterology",
    roomStart: 71,
    roomEnd: 75,
    floor: "5th Floor",
    doctors: [
      "Dr. BS. Udeshi",
      "Dr. BT. Vartak",
      "Dr. BU. Wadhwa",
      "Dr. BV. Xavier",
      "Dr. BW. Yewale",
    ],
  },
  {
    label: "Endocrinology",
    value: "Endocrinology",
    roomStart: 76,
    roomEnd: 80,
    floor: "6th Floor",
    doctors: [
      "Dr. BX. Ahuja",
      "Dr. BY. Bajaj",
      "Dr. BZ. Chitnis",
      "Dr. CA. Dhawan",
      "Dr. CB. Ebrahim",
    ],
  },
  {
    label: "Dental",
    value: "Dental",
    roomStart: 81,
    roomEnd: 85,
    floor: "6th Floor",
    doctors: [
      "Dr. CC. Fernandes",
      "Dr. CD. Gaikwad",
      "Dr. CE. Handa",
      "Dr. CF. Iyengar",
      "Dr. CG. Jha",
    ],
  },
  {
    label: "Oncology / Cancer",
    value: "Oncology / Cancer",
    roomStart: 86,
    roomEnd: 90,
    floor: "6th Floor",
    doctors: [
      "Dr. CH. Kakkar",
      "Dr. CI. Lal",
      "Dr. CJ. Mukherjee",
      "Dr. CK. Naik",
      "Dr. CL. Oberoi",
    ],
  },
  {
    label: "Radiology / Radio Diagnosis",
    value: "Radiology / Radio Diagnosis",
    roomStart: 91,
    roomEnd: 95,
    floor: "7th Floor",
    doctors: [
      "Dr. CM. Pandit",
      "Dr. CN. Qureshi",
      "Dr. CO. Raut",
      "Dr. CP. Sethi",
      "Dr. CQ. Tandon",
    ],
  },
  {
    label: "Anesthesiology",
    value: "Anesthesiology",
    roomStart: 96,
    roomEnd: 100,
    floor: "7th Floor",
    doctors: [
      "Dr. CR. Umarkar",
      "Dr. CS. Vyas",
      "Dr. CT. Wani",
      "Dr. CU. Yadhav",
      "Dr. CV. Zaveri",
    ],
  },
  {
    label: "Physiotherapy",
    value: "Physiotherapy",
    roomStart: 101,
    roomEnd: 105,
    floor: "8th Floor",
    doctors: [
      "Dr. CW. Apte",
      "Dr. CX. Bhosale",
      "Dr. CY. Chitale",
      "Dr. CZ. Dalal",
      "Dr. DA. Engineer",
    ],
  },
  {
    label: "Emergency / Casualty",
    value: "Emergency / Casualty",
    roomStart: 106,
    roomEnd: 110,
    floor: "Ground Floor",
    doctors: [
      "Dr. DB. Fonseca",
      "Dr. DC. Gaitonde",
      "Dr. DD. Hiranandani",
      "Dr. DE. Iyer",
      "Dr. DF. Jaiswal",
    ],
  },
  {
    label: "ICU / Critical Care",
    value: "ICU / Critical Care",
    roomStart: 111,
    roomEnd: 115,
    floor: "Ground Floor",
    doctors: [
      "Dr. DG. Khandelwal",
      "Dr. DH. Luthra",
      "Dr. DI. Motwani",
      "Dr. DJ. Nihalani",
      "Dr. DK. Oswal",
    ],
  },
];

export default function NewPatientRegistration() {
  const { addPatient, loading } = usePatientMgmt();
  const [showPrintForm, setShowPrintForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const validationSchema = Yup.object({
    patientName: Yup.string().required("Patient Name is required"),
    gender: Yup.string().required("Gender is required"),
    age: Yup.string().required("Age is required"),
    mobileNumber: Yup.string()
      .required("Mobile Number is required")
      .matches(/^[0-9]{10}$/, "Enter valid mobile number"),
    department: Yup.string().required("Department is required"),
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
      department: "",
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
          "department",
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
          department: values.department,
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
          const { patientId, registrarName, counterNo, registrationDate, registrationTime } = response.data;
          if (patientId) formik.setFieldValue("patientId", patientId);
          if (registrarName) formik.setFieldValue("operatorName", registrarName);
          if (counterNo) formik.setFieldValue("counterNumber", String(counterNo));
          if (registrationDate) formik.setFieldValue("registrationDate", registrationDate);
          if (registrationTime) formik.setFieldValue("registrationTime", registrationTime);
          setIsSaved(true);

          toast.success(
            `Patient saved successfully!\nPatient ID: ${patientId}`,
          );
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
  const handleNumericInput = useCallback((fieldName, maxLength) => (e) => {
    const value = e.target.value;
    const sanitized = value.replace(/[^0-9]/g, "").slice(0, maxLength);
    formik.setFieldValue(fieldName, sanitized);
  }, [formik]);

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
  const handleDepartmentChange = useCallback((selectedOption) => {
    const dept = departmentOptions.find(
      (option) => option.value === selectedOption?.value,
    );
    formik.setFieldValue("department", selectedOption?.value || "");
    formik.setFieldValue("floor", dept?.floor || "");
    formik.setFieldValue("doctorName", "");
    formik.setFieldValue("roomNumber", "");
  }, [formik]);

  const selectedDepartment = useMemo(() => {
    return departmentOptions.find(
      (option) => option.value === formik.values.department,
    );
  }, [formik.values.department]);

  const roomNumberOptions = useMemo(() => {
    if (!selectedDepartment) return [];
    return Array.from(
      {
        length: selectedDepartment.roomEnd - selectedDepartment.roomStart + 1,
      },
      (_, i) => {
        const room = selectedDepartment.roomStart + i;
        return { label: `Room ${room}`, value: String(room) };
      },
    );
  }, [selectedDepartment]);

  const doctorOptions = useMemo(() => {
    if (!selectedDepartment) return [];
    return selectedDepartment.doctors.map((doc) => ({ label: doc, value: doc }));
  }, [selectedDepartment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = await formik.validateForm();

    console.log("Formik Errors:", errors);
    console.log("Formik Values:", formik.values);

    if (Object.keys(errors).length > 0) {
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
          .join("\n")}`,
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
                  error={
                    formik.touched.address && formik.errors.address
                  }
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
                  id="department"
                  name="department"
                  label="Department"
                  options={departmentOptions}
                  placeholder="Select Department"
                  value={
                    departmentOptions.find(
                      (option) => option.value === formik.values.department,
                    ) || null
                  }
                  onChange={handleDepartmentChange}
                  onBlur={() => formik.setFieldTouched("department", true)}
                  isDisabled={isSaved}
                  required
                  error={formik.touched.department && formik.errors.department}
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
                      ? `Select Room (${selectedDepartment.roomStart}-${selectedDepartment.roomEnd})`
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
              Patient ID, Operator Name and Counter Number will be automatically generated when you click Save.
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
