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
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 min-h-screen flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-cyan-50/30"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
      
      {/* Header is now handled via RoleBasedLayout */}

      {/* Mobile Menu Toggle */}
      <div className="md:hidden p-4 flex items-center justify-between border-b shadow bg-white/90 backdrop-blur-sm relative z-10">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-700 focus:outline-none"
        >
          <Menu size={28} />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Institute Portal</h1>
      </div>

      <div className="flex flex-1 min-h-[calc(100vh-5rem)] relative z-10">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white/95 backdrop-blur-sm shadow-xl z-20 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:block border-r border-gray-100/50 ${
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
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl min-h-[80vh] border border-white/50 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-blue-50/30 rounded-3xl"></div>
            <div className="relative z-10">
            {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstitutePageLayout;
