import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import Button from '../../../components/common/Button';
import { TextInput } from '../../../components/common/FormFields';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useReceptionistMgmt from '../../../hooks/receptionishtManagement/useReceptionistMgmt';
import useDropdowns from '../../../hooks/dropdown/useDropdowns';

const mapToSelectOptions = (items) => {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item) => ({
    value: item,
    label: item
  }));
};

const validationSchema = Yup.object({
  // employeeId: Yup.string().required('Employee ID is required'),
  name: Yup.string().required('user name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  designation: Yup.object().nullable().required('Designation is required'),
  department: Yup.object().nullable().required('Department is required'),
  role: Yup.object().nullable().required('Role is required'),
  counterNo: Yup.string().when('role', {
    is: (role) => role?.value === 'payment_officer' || role?.value === 'registration_officer',
    then: (schema) => schema.required('Counter number is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  sign: Yup.mixed().required('Signature is required')
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

  const {
    departments,
    designations,
    roles,
    fetchDepartments,
    fetchDesignations,
    fetchRoles
  } = useDropdowns();

  const [photoPreview, setPhotoPreview] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState('');
  const [selectedSignature, setSelectedSignature] = useState(null);

  const designationOptions = mapToSelectOptions(designations);
  const departmentOptions = mapToSelectOptions(departments);
  const roleOptions = useMemo(() => roles || [], [roles]);

  useEffect(() => {
    fetchDesignations();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (id) {
      fetchReceptionistDetails(id);
    }

    return () => {
      resetReceptionistDetails();
    };
  }, [id]);

  const initialValues = useMemo(() => ({
    employeeId: receptionistDetails?.employeeId || '',
    name: receptionistDetails?.name || '',
    email: receptionistDetails?.email || '',
    password: receptionistDetails?.password || '',
    designation: designationOptions.find(
      (opt) => opt.value === receptionistDetails?.designation
    ) || null,
    department: departmentOptions.find(
      (opt) => opt.value === receptionistDetails?.department
    ) || null,
    role: roleOptions.find(
      (opt) => opt.value === receptionistDetails?.role
    ) || null,
    counterNo: receptionistDetails?.counterNo || '',
    photo: null,
    sign: null
  }), [receptionistDetails, designationOptions, departmentOptions, roleOptions]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('employeeId', values.employeeId || '');
        formData.append('designation', values.designation?.value || '');
        formData.append('department', values.department?.value || '');
        formData.append('role', values.role?.value || '');
        formData.append('counterNo', values.counterNo || '');

        if (selectedPhoto) {
          formData.append('photo', selectedPhoto);
        }

        if (selectedSignature) {
          formData.append('sign', selectedSignature);
        }
        let success
        if (id) {
          success = await updateReceptionist(id, formData);
        } else {
          success = await addReceptionist(formData);
        }

        if (success) {
          navigate('/receptionist-management');
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  useEffect(() => {
    if (id && receptionistDetails) {
      setPhotoPreview(receptionistDetails?.photo || '');
      setSignaturePreview(receptionistDetails?.sign || '');
    }
  }, [id, receptionistDetails]);

  useEffect(() => {
    if (formik.values.role?.value) {
      fetchDepartments(formik.values.role.value);
    } else {
      fetchDepartments();
    }
  }, [formik.values.role]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedPhoto(file);
    formik.setFieldValue('photo', file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedSignature(file);
    formik.setFieldValue('sign', file);

    const previewUrl = URL.createObjectURL(file);
    setSignaturePreview(previewUrl);
  };

  const breadcrumbPaths = [
    {
      label: 'User Management',
      url: '/receptionist-management'
    },
    {
      label: id ? 'Edit User Entry' : 'Add User Entry'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title={id ? 'Edit User Entry' : 'Add User Entry'}
      />

      <form onSubmit={formik.handleSubmit}>
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-4 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">
              User Entry Details
            </h2>

            <p className="text-sm text-gray-500">
              {id
                ? 'Update user entry information.'
                : 'Enter the credentials to create a new user entry account.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <Select
                  name="designation"
                  options={designationOptions}
                  value={formik.values.designation}
                  onChange={(option) => formik.setFieldValue('designation', option)}
                  onBlur={() => formik.setFieldTouched('designation', true)}
                  placeholder="Select designation"
                  classNamePrefix="react-select"
                  isClearable
                />
                {formik.touched.designation && formik.errors.designation && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.designation}</p>
                )}
              </div>

                 <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <Select
                  name="role"
                  options={roleOptions}
                  value={formik.values.role}
                  onChange={(option) => formik.setFieldValue('role', option)}
                  onBlur={() => formik.setFieldTouched('role', true)}
                  placeholder="Select role"
                  classNamePrefix="react-select"
                  isClearable
                />
                {formik.touched.role && formik.errors.role && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <Select
                  name="department"
                  options={departmentOptions}
                  value={formik.values.department}
                  onChange={(option) => formik.setFieldValue('department', option)}
                  onBlur={() => formik.setFieldTouched('department', true)}
                  placeholder="Select department"
                  classNamePrefix="react-select"
                  isClearable
                />
                {formik.touched.department && formik.errors.department && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.department}</p>
                )}
              </div>

              {(formik.values.role?.value === 'payment_officer' || formik.values.role?.value === 'registration_officer') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Counter Number <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    name="counterNo"
                    value={formik.values.counterNo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter counter number"
                    required
                    icon="pi pi-hashtag"
                    error={formik.touched.counterNo && formik.errors.counterNo}
                  />
                </div>
              )}

            </div>

            <TextInput
              label="Employee ID"
              name="employeeId"
              value={formik.values.employeeId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter employee ID"
              required
              icon="pi-id-card"
              disabled={id}
              error={formik.touched.employeeId && formik.errors.employeeId}
            />

            <TextInput
              label="User Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter full name"
              required
              icon="pi-user"
              error={formik.touched.name && formik.errors.name}
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
              error={formik.touched.email && formik.errors.email}
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
              error={formik.touched.password && formik.errors.password}
            />

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo {!id && <span className="text-red-500">*</span>}
              </label>

              <div className="flex items-start gap-4 flex-wrap">
                <div className="w-28 h-28 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400 text-xs px-2">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0 file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    {id
                      ? 'Upload a new image if you want to change the existing photo.'
                      : 'Upload profile photo for the user entry.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature {!id && <span className="text-red-500">*</span>}
              </label>

              <div className="flex items-start gap-4 flex-wrap">
                <div className="w-28 h-28 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {signaturePreview ? (
                    <img
                      src={signaturePreview}
                      alt="Signature Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400 text-xs px-2">
                      No Signature
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0 file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    {id
                      ? 'Upload a new signature image if you want to change the existing signature.'
                      : 'Upload digital signature for the user entry.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Button
              type="button"
              label="Cancel"
              variant="secondary"
              icon="pi pi-times"
              onClick={() => navigate('/receptionist-management')}
            />

            <Button
              type="submit"
              label={loading ? 'Please Wait...' : id ? 'Update' : 'Save'}
              variant="primary"
              icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-save'}
              className="px-6"
              disabled={loading}
            />
          </div>
        </div>
      </form>
    </div>
  );
}