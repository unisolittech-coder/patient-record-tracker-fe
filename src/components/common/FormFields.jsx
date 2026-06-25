import React from 'react';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';

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

export const TextInput = ({
  id,
  name,
  label,
  required,
  error,
  className = '',
  ...props
}) => {
  const fieldId = id || name;

  return (
    <FieldWrapper id={fieldId} label={label} required={required} error={error}>
      <InputText
        id={fieldId}
        name={name}
        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
    </FieldWrapper>
  );
};

export const TextAreaInput = ({
  id,
  name,
  label,
  required,
  error,
  rows = 3,
  className = '',
  ...props
}) => {
  const fieldId = id || name;

  return (
    <FieldWrapper id={fieldId} label={label} required={required} error={error}>
      <InputTextarea
        id={fieldId}
        name={name}
        rows={rows}
        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors resize-y ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
    </FieldWrapper>
  );
};

export const SelectInput = ({
  id,
  name,
  label,
  required,
  error,
  options = [],
  value,
  onChange,
  onBlur,
  placeholder = 'Select',
  isClearable = true,
  isDisabled = false,
  menuPosition = 'fixed',
  ...props
}) => {
  const fieldId = id || name;

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '44px',
      borderRadius: '0.5rem',
      borderColor: error ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused
        ? '0 0 0 2px rgba(59, 130, 246, 0.15)'
        : 'none',
      '&:hover': {
        borderColor: error ? '#ef4444' : '#3b82f6'
      }
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 10px'
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#374151'
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999
    })
  };

  return (
    <FieldWrapper id={fieldId} label={label} required={required} error={error}>
      <Select
        inputId={fieldId}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        isClearable={isClearable}
        isDisabled={isDisabled}
        styles={customStyles}
        classNamePrefix="react-select"
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        menuPosition={menuPosition}
        {...props}
      />
    </FieldWrapper>
  );
};

export const DateInput = ({
  id,
  name,
  label,
  required,
  error,
  value,
  onChange,
  onBlur,
  placeholder = 'Select date',
  dateFormat = 'dd/MM/yyyy',
  maxDate,
  minDate,
  disabled = false,
  showMonthDropdown = true,
  showYearDropdown = true,
  dropdownMode = 'select',
  ...props
}) => {
  const fieldId = id || name;

  let selectedDate = null;

  if (value instanceof Date) {
    selectedDate = value;
  } else if (value && dayjs(value).isValid()) {
    selectedDate = dayjs(value).toDate();
  }

  return (
    <FieldWrapper id={fieldId} label={label} required={required} error={error}>
      <div className="relative">
        <DatePicker
          id={fieldId}
          name={name}
          selected={selectedDate}
          onChange={(date) => onChange?.(date)}
          onBlur={onBlur}
          placeholderText={placeholder}
          dateFormat={dateFormat}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          showMonthDropdown={showMonthDropdown}
          showYearDropdown={showYearDropdown}
          dropdownMode={dropdownMode}
          autoComplete="off"
          className={`w-full p-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          wrapperClassName="w-full"
          popperPlacement="bottom-start"
          popperClassName="z-[9999]"
          {...props}
        />

        <i className="pi pi-calendar absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </FieldWrapper>
  );
};

export const FileInput = ({
  id,
  name,
  label,
  required,
  error,
  onUpload,
  accept,
  maxFileSize = 10000000,
  ...props
}) => {
  const fieldId = id || name;

  return (
    <FieldWrapper id={fieldId} label={label} required={required} error={error}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-1 bg-gray-50 hover:bg-gray-100 transition-colors">
        <FileUpload
          mode="basic"
          name={name || fieldId}
          accept={accept}
          maxFileSize={maxFileSize}
          onUpload={onUpload}
          chooseLabel="Browse"
          className="w-full"
          pt={{
            chooseButton: {
              className:
                'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm py-1.5 px-3 rounded shadow-sm w-full font-medium flex justify-center'
            },
            chooseIcon: { className: 'mr-2 text-gray-500' }
          }}
          {...props}
        />
      </div>
    </FieldWrapper>
  );
};