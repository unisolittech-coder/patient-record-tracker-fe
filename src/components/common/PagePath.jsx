import React from 'react';
import Button from './Button';

export default function PagePath({
  title,
  showAddButton = false,
  onAdd,
  addButtonLabel = "Add",
  showSearchBar = false,
  searchValue = "",
  onSearch,
  searchPlaceholder = "Search...",
  children
}) {
  return (
    <div className="py-3 px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-xl bg-white shadow-sm border border-gray-200 gap-2 mb-4">
      <h1 className="text-2xl font-bold text-gray-800">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        {showSearchBar && (
          <div className="relative">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {children}

        {showAddButton && (
          <Button
            label={addButtonLabel}
            icon="pi pi-plus"
            variant="primary"
            onClick={onAdd}
          />
        )}
      </div>
    </div>
  );
}