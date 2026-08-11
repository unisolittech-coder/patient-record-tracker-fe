import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useIggmcPatient } from '../../../hooks/iggmcPatient/useIggmcPatient';

export default function IggmcBloodCollectionCenter() {
  const { loading, createPatient } = useIggmcPatient();

  const validationSchema = Yup.object({
    uhid: Yup.string().required('UHID is required'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    patientName: Yup.string().required('Patient Name is required'),
    abhaNumber: Yup.string()
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
      }
    }
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Register IGGMC Patient</h2>
        
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">UHID *</label>
            <InputText
              name="uhid"
              value={formik.values.uhid}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter UHID"
              className={`w-full p-3 border rounded-xl ${formik.touched.uhid && formik.errors.uhid ? 'border-red-400' : 'border-gray-300'}`}
            />
            {formik.touched.uhid && formik.errors.uhid && (
              <small className="text-red-500">{formik.errors.uhid}</small>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Patient Name *</label>
            <InputText
              name="patientName"
              value={formik.values.patientName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Patient Name"
              className={`w-full p-3 border rounded-xl ${formik.touched.patientName && formik.errors.patientName ? 'border-red-400' : 'border-gray-300'}`}
            />
            {formik.touched.patientName && formik.errors.patientName && (
              <small className="text-red-500">{formik.errors.patientName}</small>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Mobile Number *</label>
            <InputText
              name="mobileNumber"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Mobile Number"
              className={`w-full p-3 border rounded-xl ${formik.touched.mobileNumber && formik.errors.mobileNumber ? 'border-red-400' : 'border-gray-300'}`}
            />
            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
              <small className="text-red-500">{formik.errors.mobileNumber}</small>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">ABHA Number (Optional)</label>
            <InputText
              name="abhaNumber"
              value={formik.values.abhaNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter ABHA Number"
              className="w-full p-3 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="md:col-span-2 flex justify-end mt-4">
            <Button
              type="submit"
              disabled={loading}
              label={loading ? 'Registering...' : 'Register Patient'}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition-colors"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
