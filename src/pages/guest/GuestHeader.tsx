import React from 'react';
import { Button } from '../../components/ui/input';

interface GuestHeaderProps {
  guestName: string;
  onLogout?: () => void;
}

const GuestHeader: React.FC<GuestHeaderProps> = ({ guestName, onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 sticky top-0 z-10 h-24">
      <div className="w-full h-full flex justify-between items-center px-0">
        {/* Logo section */}
        <div className="h-full pl-6 flex items-center">
          <img
            src="/beatinblink3.png"
            alt="BeatInBlink Logo"
            className="h-full object-contain"
            style={{ maxWidth: '320px' }}
          />
        </div>

        {/* Right side nav */}
        <nav className="flex items-center gap-6 pr-6 text-sm font-medium text-gray-700">
          <span className="text-gray-600 hidden sm:inline">
            👋 Hello, <span className="font-semibold text-green-700">{guestName}</span>
          </span>

          {onLogout && (
            <Button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition-all"
            >
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default GuestHeader;
