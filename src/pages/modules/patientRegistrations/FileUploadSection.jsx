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
    { id: 'ultrasoundReport', label: 'Ultrasound Reports', icon: '👶' },
    { id: 'ecgReport', label: 'ECG Reports', icon: '❤️' },
    { id: 'dischargeSummary', label: 'Discharge Summary', icon: '📄' },
  ];

  const handleFileSelect = (fieldId) => (event) => {
    console.log(`File selected for ${fieldId}`);
    const file = event.target.files[0];
    console.log(`File object:`, file);
    
    if (file) {
      const success = onFileChange(fieldId, file);
      console.log(`File change success:`, success);
      
      if (success) {
        setUploadedFiles(prev => ({
          ...prev,
          [fieldId]: file
        }));
        console.log(`Uploaded files state updated:`, { ...uploadedFiles, [fieldId]: file });
      }
    } else {
      console.log(`No file selected for ${fieldId}`);
    }
  };

  const handleRemoveFile = (fieldId) => {
    console.log(`Removing file from ${fieldId}`);
    onRemoveFile(fieldId);
    setUploadedFiles(prev => {
      const newState = { ...prev };
      delete newState[fieldId];
      console.log(`Updated uploaded files:`, newState);
      return newState;
    });
    // Reset file input
    const input = document.getElementById(fieldId);
    if (input) {
      input.value = '';
      console.log(`Reset file input for ${fieldId}`);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-4 pb-2 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">Report Upload Module</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload relevant medical documents (Max size 10MB per file). 
          <span className="text-red-500 ml-1 font-medium">* At least one document is required</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fileConfigs.map((config) => {
          const file = uploadedFiles[config.id];
          const isUploaded = !!file;
          
          return (
            <div key={config.id} className="border rounded-lg p-4 hover:border-blue-400 transition-colors relative" style={{ zIndex: 1 }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{config.icon}</span>
                  <label className="text-sm font-medium text-gray-700" htmlFor={config.id}>
                    {config.label}
                  </label>
                  {!isUploaded && <span className="text-xs text-gray-400">(Optional)</span>}
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
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    style={{ zIndex: 1, position: 'relative' }}
                  />
                  <p className="text-xs text-gray-400 mt-1">Upload PDF, Image or Document</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate flex-1">
                      <span className="text-blue-500">📎</span>
                      <span className="text-sm text-gray-700 truncate" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(config.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* File Preview for Images */}
                  {file.type?.startsWith('image/') && (
                    <div className="mt-2 border rounded overflow-hidden">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  )}
                  
                  {/* File Preview for PDFs */}
                  {file.type === 'application/pdf' && (
                    <div className="mt-2 flex items-center justify-center bg-red-50 rounded p-2">
                      <span className="text-red-500 text-sm">📄 PDF Document</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Other Documents - Full Width */}
      <div className="mt-6 border-t border-dashed border-gray-200 pt-4">
        <div className="border rounded-lg p-4 hover:border-blue-400 transition-colors relative" style={{ zIndex: 1 }}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📁</span>
              <label className="text-sm font-medium text-gray-700" htmlFor="otherMedicalDocuments">
                Other Medical Documents
              </label>
              {!uploadedFiles.otherMedicalDocuments && (
                <span className="text-xs text-gray-400">(Optional)</span>
              )}
            </div>
            {uploadedFiles.otherMedicalDocuments && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                ✓ Uploaded
              </span>
            )}
          </div>
          
          {!uploadedFiles.otherMedicalDocuments ? (
            <div className="relative">
              <input
                type="file"
                id="otherMedicalDocuments"
                name="otherMedicalDocuments"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileSelect('otherMedicalDocuments')}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                style={{ zIndex: 1, position: 'relative' }}
              />
              <p className="text-xs text-gray-400 mt-1">Upload any other medical documents</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate flex-1">
                  <span className="text-blue-500">📎</span>
                  <span className="text-sm text-gray-700 truncate" title={uploadedFiles.otherMedicalDocuments.name}>
                    {uploadedFiles.otherMedicalDocuments.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    {formatFileSize(uploadedFiles.otherMedicalDocuments.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile('otherMedicalDocuments')}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              {/* Preview for other documents */}
              {uploadedFiles.otherMedicalDocuments.type?.startsWith('image/') && (
                <div className="mt-2 border rounded overflow-hidden">
                  <img 
                    src={URL.createObjectURL(uploadedFiles.otherMedicalDocuments)} 
                    alt={uploadedFiles.otherMedicalDocuments.name}
                    className="w-full h-24 object-cover"
                  />
                </div>
              )}
              
              {uploadedFiles.otherMedicalDocuments.type === 'application/pdf' && (
                <div className="mt-2 flex items-center justify-center bg-red-50 rounded p-2">
                  <span className="text-red-500 text-sm">📄 PDF Document</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Operation Notes */}
      <div className="mt-6">
        <TextAreaInput 
          id="operationNotes" 
          name="operationNotes"
          label="Operation Notes (Optional)" 
          placeholder="Type any operation or procedure notes here..." 
          rows={4}
          value={formik.values.operationNotes || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
    </section>
  );
};

export default FileUploadSection;