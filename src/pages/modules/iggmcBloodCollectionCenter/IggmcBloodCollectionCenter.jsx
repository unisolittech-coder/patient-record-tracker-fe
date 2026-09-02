import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../../../components/common/Button';
import { TextInput } from '../../../components/common/FormFields';
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import { useIggmcPatient } from '../../../hooks/iggmcPatient/useIggmcPatient';
import { toast } from "react-toastify";

export default function IggmcBloodCollectionCenter() {
  const { loading, patient, createPatient, fetchPatientByUhid } = useIggmcPatient();
  const [uniqueId, setUniqueId] = useState("");
  const [searched, setSearched] = useState(false);
  const [isPatientFound, setIsPatientFound] = useState(false);

  useEffect(() => {
    if (!uniqueId.trim()) {
      setSearched(false);
      setIsPatientFound(false);
    }
  }, [uniqueId]);

  const handleSearch = async () => {
    if (!uniqueId.trim()) {
      toast.error("Please enter a UHID");
      return;
    }
    setSearched(false);
    setIsPatientFound(false);
    const success = await fetchPatientByUhid(uniqueId);
    if (success) {
      formik.setValues({
        uhid: success.uhid || '',
        mobileNumber: success.mobileNumber || '',
        patientName: success.patientName || '',
        abhaNumber: success.abhaNumber || ''
      });
      setIsPatientFound(true);
    } else {
      formik.setValues({
        uhid: '',
        mobileNumber: '',
        patientName: '',
        abhaNumber: ''
      });
      setIsPatientFound(false);
    }
    setSearched(true);
  };

  const breadcrumbPaths = [
    { label: 'IGGMC Blood Collection Center', url: '/iggmc-blood-collection-center' },
    { label: 'Register Patient' }
  ];

  const validationSchema = Yup.object({
    uhid: Yup.string().required('UHID is required'),
    mobileNumber: Yup.string()
      .required('Mobile Number is required')
      .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
    patientName: Yup.string().required('Patient Name is required'),
    abhaNumber: Yup.string()
      .nullable()
      .notRequired()
  });

  const formik = useFormik({
    initialValues: {
      uhid: '',
      mobileNumber: '',
      patientName: '',
      abhaNumber: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const success = await createPatient(values);
      if (success) {
        resetForm();
        setSearched(false);
        setIsPatientFound(false);
        setUniqueId("");
      }
    }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title="Register IGGMC Patient"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Search Patient</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <TextInput
                id="uniqueId"
                name="uniqueId"
                label="UHID"
                required
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                placeholder="Enter patient UHID"
                disabled={loading}
              />
            </div>
            <Button
              type="button"
              label="Search"
              icon="pi pi-search"
              variant="primary"
              onClick={handleSearch}
              disabled={loading || !uniqueId.trim()}
            />
          </div>
          {searched && patient?.patientName && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Patient Name</label>
              <div className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 min-h-[42px]">
                {patient.patientName}
              </div>
            </div>
          )}
        </div>
      </div>

      {searched && (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                Patient Information
              </h2>
              <p className="text-sm text-gray-500">
                Enter the patient details to register a new IGGMC patient.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                name="uhid"
                label="UHID"
                required
                value={formik.values.uhid}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter UHID"
                error={formik.touched.uhid && formik.errors.uhid}
                disabled={isPatientFound}
              />

              <TextInput
                name="patientName"
                label="Patient Name"
                required
                value={formik.values.patientName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Patient Name"
                error={formik.touched.patientName && formik.errors.patientName}
                disabled={isPatientFound}
              />

              <TextInput
                name="mobileNumber"
                label="Mobile Number"
                required
                type="tel"
                maxLength={10}
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Mobile Number"
                error={formik.touched.mobileNumber && formik.errors.mobileNumber}
                disabled={isPatientFound}
              />

              <TextInput
                name="abhaNumber"
                label="ABHA Number"
                maxLength={17}
                value={formik.values.abhaNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter ABHA Number"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end gap-3">
            <Button
              type="submit"
              label={loading ? 'Registering...' : 'Register Patient'}
              icon="pi pi-save"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="px-6"
            />
          </div>
        </form>
      )}
    </div>
  );
}
