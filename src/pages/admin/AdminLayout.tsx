// src/pages/admin/AdminLayout.tsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-green-700 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              isActive ? 'font-bold underline' : ''
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="companies"
            className={({ isActive }) =>
              isActive ? 'font-bold underline' : ''
            }
          >
            Companies
          </NavLink>
          <NavLink
            to="regions"
            className={({ isActive }) =>
              isActive ? 'font-bold underline' : ''
            }
          >
            Regions
          </NavLink>
        </nav>
      </aside>
      <main className="flex-grow p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
