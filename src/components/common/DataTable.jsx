import React from 'react';
import { DataTable as PrimeDataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function DataTable({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = "No records found.",
  className = "",
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
    >
      <PrimeDataTable
        value={data}
        loading={loading}
        responsiveLayout="scroll"
        stripedRows
        scrollable
        emptyMessage={
          <div className="flex flex-col items-center justify-center py-12">
            <i className="pi pi-inbox text-5xl text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">
              {emptyMessage}
            </p>
          </div>
        }
        pt={{
          root: {
            className: "w-full"
          },

          wrapper: {
            className: "overflow-x-auto"
          },

          table: {
            className: "w-full"
          },

          headerRow: {
            className: "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
          },

          headerCell: {
            className:
              "bg-blue-600 text-white text-sm font-semibold whitespace-nowrap border-r border-blue-300"
          },

          bodyRow: {
            className:
              "border-b border-slate-100 hover:bg-blue-50 transition-colors duration-200"
          },

          bodyCell: {
            className:
              "text-sm text-slate-700 border-r border-slate-100 !py-1"
          },

          loadingOverlay: {
            className: "bg-white/80 backdrop-blur-sm"
          }
        }}
        {...props}
      >
        {columns.map((col, index) => (
          <Column
            key={index}
            field={col.field}
            header={col.header}
            body={col.body}
            sortable={col.sortable}
            style={{
              minWidth: col.minWidth || "100px",
              padding: "18px 20px",
              ...col.style
            }}
            className={col.className}
            headerClassName={col.headerClassName}
            pt={{
              headerContent: { className: 'flex items-center gap-1' },
              // sortIcon: { className: 'ml-1' }
            }}
          />
        ))}
      </PrimeDataTable>
    </div>
  );
}