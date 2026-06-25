import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import Button from '../../../components/common/Button';
import { TextInput } from '../../../components/common/FormFields';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useReceptionistMgmt from '../../../hooks/receptionishtManagement/useReceptionistMgmt';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Data Entry Operator name is required'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

export default function AddEditReceptionisht() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    addReceptionist,
    updateReceptionist,
    fetchReceptionistDetails,
    resetReceptionistDetails,
    receptionistDetails,
    loading
  } = useReceptionistMgmt();

  useEffect(() => {
    if (id) {
      fetchReceptionistDetails(id);
    }

    return () => {
      resetReceptionistDetails();
    };
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: receptionistDetails?.name || '',
      email: receptionistDetails?.email || '',
      password: receptionistDetails?.password || ''
    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        if (id) {
          await updateReceptionist(id, values);
        } else {
          await addReceptionist(values);
        }

        navigate('/receptionist-management');
      } catch (error) {
        console.error(error);
      }
    }
  });

  const breadcrumbPaths = [
    {
      label: 'Data Entry Operator Management',
      url: '/receptionist-management'
    },
    {
      label: id ? 'Edit Data Entry Operator' : 'Add Data Entry Operator'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title={id ? 'Edit Data Entry Operator' : 'Add Data Entry Operator'}
      />

      <form onSubmit={formik.handleSubmit}>
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">

          <div className="mb-4 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">
              Data Entry Operator Details
            </h2>

            <p className="text-sm text-gray-500">
              {id
                ? 'Update receptionist information.'
                : 'Enter the credentials to create a new receptionist account.'}
            </p>
          </div>

          <div className="space-y-4">

            <TextInput
              label="Data Entry Operator Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter full name"
              required
              icon="pi-user"
              error={
                formik.touched.name && formik.errors.name
              }
            />

            <TextInput
              label="Email ID"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter email address"
              required
              icon="pi-envelope"
              error={
                formik.touched.email && formik.errors.email
              }
            />

            <TextInput
              label="Password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter secure password"
              required
              icon="pi-lock"
              error={
                formik.touched.password &&
                formik.errors.password
              }
            />

          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3">

            <Button
              type="button"
              label="Cancel"
              variant="secondary"
              icon="pi pi-times"
              onClick={() =>
                navigate('/receptionist-management')
              }
            />

            <Button
              type="submit"
              label={
                loading
                  ? 'Please Wait...'
                  : id
                    ? 'Update'
                    : 'Save'
              }
              variant="primary"
              icon={
                loading
                  ? 'pi pi-spin pi-spinner'
                  : 'pi pi-save'
              }
              className="px-6"
              disabled={loading}
            />

          </div>
        </div>
      </form>
    </div>
  );
}