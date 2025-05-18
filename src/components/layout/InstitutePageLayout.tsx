import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import InstituteHeader from '../../pages/admin/InstHeader';
import { Menu } from 'lucide-react';

interface InstitutePageLayoutProps {
  enabledTabs: string[];
  children: React.ReactNode;
}

const InstitutePageLayout: React.FC<InstitutePageLayoutProps> = ({ enabledTabs, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col">
      {/* Header is now handled via RoleBasedLayout */}

      {/* Mobile Menu Toggle */}
      <div className="md:hidden p-4 flex items-center justify-between border-b shadow bg-white">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-700 focus:outline-none"
        >
          <Menu size={28} />
        </button>
        <h1 className="text-lg font-semibold text-blue-700">Institute Portal</h1>
      </div>

      <div className="flex flex-1 min-h-[calc(100vh-5rem)]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md z-20 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:block ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar enabledTabs={enabledTabs} />
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl min-h-[80vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstitutePageLayout;
