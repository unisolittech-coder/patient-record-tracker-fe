import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '../../../components/common/BreadCrumb';
import PagePath from '../../../components/common/PagePath';
import Button from '../../../components/common/Button';
import { TextInput } from '../../../components/common/FormFields';

export default function AddEditReceptionisht() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const breadcrumbPaths = [
    { label: 'Receptionist Management', url: '/receptionist-management' },
    { label: 'Add Receptionist' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving Receptionist:', formData);
    // Submit logic goes here
    navigate('/receptionist-management');
  };

  const handleCancel = () => {
    navigate('/receptionist-management');
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-2">
        <BreadCrumb paths={breadcrumbPaths} />
      </div>

      <PagePath title="Add Receptionist" />

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Receptionist Details</h2>
          <p className="text-sm text-gray-500">Enter the credentials to create a new receptionist account.</p>
        </div>

        <div className="space-y-6">
          <TextInput
            label="Receptionist Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            required
            icon="pi-user"
          />

          <TextInput
            label="Email ID"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            placeholder="Enter email address"
            required
            icon="pi-envelope"
          />

          <TextInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            placeholder="Enter secure password"
            required
            icon="pi-lock"
          />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Button
            label="Cancel"
            variant="secondary"
            icon="pi pi-times"
            onClick={handleCancel}
          />
          <Button
            label="Save Receptionist"
            variant="primary"
            icon="pi pi-save"
            onClick={handleSave}
            className="px-6"
          />
        </div>
      </div>
    </div>
  );
}
