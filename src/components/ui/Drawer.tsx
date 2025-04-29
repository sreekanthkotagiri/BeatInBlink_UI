import React from 'react';
import { X } from 'lucide-react'; // Assuming you're using lucide icons, else adjust

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string; // default width if not passed
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, width = '50%', children }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ width }}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="p-6 overflow-y-auto h-[calc(100%-4rem)]">
        {children}
      </div>
    </div>
  );
};
