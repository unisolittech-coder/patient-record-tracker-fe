import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectButton } from 'primereact/selectbutton';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLogin } from '../../hooks/auth/useLogin';
import validator from "validator";

export default function Login() {
  const { loading, adminLogin } = useLogin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = ['Admin', 'Receptionist'];

  const validationSchema = Yup.object({
    role: Yup.string().required('Role is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
  });

  const formik = useFormik({
    initialValues: {
      role: 'Admin',
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        email: validator.trim(values.email),
        password: validator.trim(values.password),
      };
      
      const success = await adminLogin(payload);
      if (success) {
        navigate("/dashboard");
      }
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="relative w-full max-w-md">

        {/* Background Blur */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />

        {/* Login Card */}
        <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-blue-200/50 border border-white/50">

          {/* Top Accent */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full" />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h1>

            <p className="text-gray-500">
              Sign in to continue to MediCare
            </p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Role Selection */}
            <div className="flex justify-center">
              <SelectButton
                value={formik.values.role}
                onChange={(e) =>
                  formik.setFieldValue('role', e.value)
                }
                options={roleOptions}
                className="w-full"
                pt={{
                  root: {
                    className:
                      'bg-blue-50/50 rounded-xl p-1 border border-blue-100 flex gap-2 w-full'
                  },
                  button: ({ context }) => ({
                    className: context.selected
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white flex-1 py-2.5 px-4 font-semibold rounded-lg transition-all duration-300 shadow-md shadow-blue-300/50 text-center'
                      : 'bg-transparent text-gray-600 hover:text-gray-800 hover:bg-blue-100/50 flex-1 py-2.5 px-4 font-medium rounded-lg transition-all duration-300 text-center'
                  })
                }}
              />
            </div>

            {/* User ID */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="pi pi-user text-blue-500"></i>
                {formik.values.role} ID
              </label>

              <div className="relative">
                <i className="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 z-10" />

                <InputText
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={`Enter your ${formik.values.role.toLowerCase()} email`}
                  className={`w-full pl-12 pr-4 py-3.5 bg-blue-50/50 border-2 rounded-xl text-gray-700 placeholder:text-gray-400 focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 ${formik.touched.email && formik.errors.email
                    ? 'border-red-400'
                    : 'border-blue-100'
                    }`}
                />
              </div>

              {formik.touched.email && formik.errors.email && (
                <small className="text-red-500 text-xs">
                  {formik.errors.email}
                </small>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="pi pi-lock text-blue-500"></i>
                Password
              </label>

              <div className="relative">
                <i className="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 z-10" />

                <InputText
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-blue-50/50 border-2 border-blue-100 rounded-xl"
                />

                <i
                  onClick={() => setShowPassword(!showPassword)}
                  className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'
                    } absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-blue-400`}
                />
              </div>

              {formik.touched.password &&
                formik.errors.password && (
                  <small className="text-red-500 text-xs">
                    {formik.errors.password}
                  </small>
                )}
              {/* 
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div> */}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              label={loading ? 'Signing In...' : 'Sign In'}
              // icon={loading ? 'pi pi-spin pi-spinner' : 'Sign In'}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-none rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-300/50 hover:shadow-xl hover:shadow-blue-400/50 hover:scale-[1.02] active:scale-[0.98] text-white"
            />
          </form>
        </div>
      </div>
    </div>
  );
}