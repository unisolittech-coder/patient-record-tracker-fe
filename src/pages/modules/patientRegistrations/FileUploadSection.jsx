import React, { useState } from 'react';
import { TextAreaInput } from '../../../components/common/FormFields';

const FileUploadSection = ({ formik, onFileChange, onRemoveFile }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});

  const fileConfigs = [
    { id: 'prescription', label: 'Prescription', icon: '📋' },
    { id: 'labReport', label: 'Lab Reports', icon: '🔬' },
    { id: 'bloodReport', label: 'Blood Reports', icon: '🩸' },
    { id: 'xrayReport', label: 'X-Ray Reports', icon: '🦴' },
    { id: 'ctScanReport', label: 'CT Scan Reports', icon: '🧠' },
    { id: 'mriReport', label: 'MRI Reports', icon: '🔍' },
    // { id: 'ultrasoundReport', label: 'Ultrasound Reports', icon: '👶' },
    // { id: 'ecgReport', label: 'ECG Reports', icon: '❤️' },
    // { id: 'dischargeSummary', label: 'Discharge Summary', icon: '📄' },
    { id: 'operationNotes', label: 'Operation Notes Document', icon: '📝' }, // added as upload
  ];

  const handleFileSelect = (fieldId) => (event) => {
    const file = event.target.files[0];

    if (file) {
      const success = onFileChange(fieldId, file);

      if (success) {
        setUploadedFiles((prev) => ({
          ...prev,
          [fieldId]: file
        }));
      }
    }
  };

  const handleRemoveUploadedFile = (fieldId) => {
    onRemoveFile(fieldId);

    setUploadedFiles((prev) => {
      const newState = { ...prev };
      delete newState[fieldId];
      return newState;
    });

    const input = document.getElementById(fieldId);
    if (input) input.value = '';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const renderFileUploadCard = (config) => {
    const file = uploadedFiles[config.id] || formik.values?.[config.id];
    const isUploaded = !!file;

    return (
      <div
        key={config.id}
        className="border rounded-lg p-4 hover:border-blue-400 transition-colors relative"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor={config.id}
            >
              {config.label}
            </label>
            {!isUploaded && (
              <span className="text-xs text-gray-400">(Optional)</span>
            )}
          </div>

          {isUploaded && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
              ✓ Uploaded
            </span>
          )}
        </div>

        {!isUploaded ? (
          <div className="relative">
            <input
              type="file"
              id={config.id}
              name={config.id}
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelect(config.id)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                         file:rounded-full file:border-0 file:text-sm file:font-semibold 
                         file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-1">
              Upload PDF, Image or Document
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate flex-1">
                <span className="text-blue-500">📎</span>
                <span
                  className="text-sm text-gray-700 truncate"
                  title={file.name}
                >
                  {file.name}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveUploadedFile(config.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Image Preview */}
            {file?.type?.startsWith('image/') && (
              <div className="mt-2 border rounded overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-24 object-cover"
                />
              </div>
            )}

            {/* PDF Preview */}
            {file?.type === 'application/pdf' && (
              <div className="mt-2 flex items-center justify-center bg-red-50 rounded p-2">
                <span className="text-red-500 text-sm">📄 PDF Document</span>
              </div>
            )}

            {/* Word Preview */}
            {(file?.type === 'application/msword' ||
              file?.type ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document') && (
              <div className="mt-2 flex items-center justify-center bg-blue-50 rounded p-2">
                <span className="text-blue-600 text-sm">📝 Word Document</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-4 pb-2 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">
          Report Upload Module
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload relevant medical documents (Max size 10MB per file).
          <span className="text-red-500 ml-1 font-medium">
            * At least one document is required
          </span>
        </p>
      </div>

      {/* Main Report Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fileConfigs.map((config) => renderFileUploadCard(config))}
      </div>

      {/* Other Medical Documents */}
      <div className="mt-6 border-t border-dashed border-gray-200 pt-4">
        {renderFileUploadCard({
          id: 'otherMedicalDocuments',
          label: 'Other Medical Documents',
          icon: '📁'
        })}
      </div>

      {/* Reports Remarks */}
      <div className="mt-6">
        <TextAreaInput
          id="reportsRemarks"
          name="reportsRemarks"
          label="Reports Remarks"
          placeholder="Enter report remarks / observations..."
          rows={4}
          value={formik.values.reportsRemarks || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
    </section>
  );
};

export default FileUploadSection;