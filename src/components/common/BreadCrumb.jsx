import React from 'react';
import { BreadCrumb as PrimeBreadCrumb } from 'primereact/breadcrumb';
import { useNavigate } from 'react-router-dom';

export default function BreadCrumb({ paths }) {
  const navigate = useNavigate();
  const home = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const items = paths.map(path => ({
    label: path.label,
    command: () => {
      if (path.url) navigate(path.url);
    }
  }));

  return (
    <div className="mb-4">
      <PrimeBreadCrumb
        model={items}
        home={home}
        className="bg-transparent border-none p-0"
        pt={{
          root: { className: 'bg-transparent border-none p-0 m-0' },
          menu: { className: 'm-0 p-0' },
          action: { className: 'text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium' },
          separator: { className: 'text-gray-400 mx-2 text-xs' }
        }}
      />
    </div>
  );
}
