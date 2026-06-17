import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';

const FieldWrapper = ({ id, label, required, children, error }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && (
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {children}
    {error && <small className="text-red-500 text-xs mt-1">{error}</small>}
  </div>
);

const sharedPt = {
  root: { className: 'w-full shadow-sm rounded-lg border-gray-300 hover:border-blue-500 focus:ring-blue-500' }
};

export const TextInput = ({ id, label, required, error, className = '', ...props }) => (
  <FieldWrapper id={id} label={label} required={required} error={error}>
    <InputText 
      id={id} 
      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:border-blue-500 transition-colors ${error ? 'border-red-500' : 'border-gray-300'} ${className}`} 
      {...props} 
    />
  </FieldWrapper>
);

export const TextAreaInput = ({ id, label, required, error, rows = 3, className = '', ...props }) => (
  <FieldWrapper id={id} label={label} required={required} error={error}>
    <InputTextarea 
      id={id} 
      rows={rows}
      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:border-blue-500 transition-colors resize-y ${error ? 'border-red-500' : 'border-gray-300'} ${className}`} 
      {...props} 
    />
  </FieldWrapper>
);

export const SelectInput = ({ id, label, required, error, options, ...props }) => (
  <FieldWrapper id={id} label={label} required={required} error={error}>
    <Dropdown 
      id={id} 
      options={options} 
      className={`w-full border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`} 
      pt={{
        root: { className: 'w-full flex items-center p-0.5' },
        input: { className: 'p-2.5 text-gray-700' },
        trigger: { className: 'w-10 flex items-center justify-center text-gray-500' }
      }}
      {...props} 
    />
  </FieldWrapper>
);

export const DateInput = ({ id, label, required, error, ...props }) => (
  <FieldWrapper id={id} label={label} required={required} error={error}>
    <Calendar 
      id={id} 
      showIcon 
      className={`w-full border rounded-lg overflow-hidden ${error ? 'border-red-500' : 'border-gray-300'}`}
      pt={{
        input: { className: 'p-2.5 w-full text-gray-700 outline-none' },
        dropdownButton: { root: { className: 'bg-gray-50 border-l border-gray-300 text-gray-600 hover:bg-gray-100 px-3 transition-colors' } }
      }}
      {...props} 
    />
  </FieldWrapper>
);

export const FileInput = ({ id, label, required, error, onUpload, accept, maxFileSize = 10000000, ...props }) => (
  <FieldWrapper id={id} label={label} required={required} error={error}>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-1 bg-gray-50 hover:bg-gray-100 transition-colors">
      <FileUpload 
        mode="basic" 
        name={id} 
        accept={accept} 
        maxFileSize={maxFileSize} 
        onUpload={onUpload} 
        chooseLabel="Browse"
        className="w-full"
        pt={{
          chooseButton: { className: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm py-1.5 px-3 rounded shadow-sm w-full font-medium flex justify-center' },
          chooseIcon: { className: 'mr-2 text-gray-500' }
        }}
        {...props}
      />
    </div>
  </FieldWrapper>
);
