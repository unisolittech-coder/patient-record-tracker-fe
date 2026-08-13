import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../../../components/common/Button';
import { TextInput } from '../../../components/common/FormFields';
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import { useIggmcPatient } from '../../../hooks/iggmcPatient/useIggmcPatient';

export default function IggmcBloodCollectionCenter() {
  const { loading, createPatient } = useIggmcPatient();

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
      // .matches(/^\d{2}-\d{4}-\d{4}-\d{4}$/, 'ABHA number must be in format 12-3456-7890-1234')
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
    <div className="max-w-7xl mx-auto">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title="Register IGGMC Patient"
      />

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
    </div>
  );
}
