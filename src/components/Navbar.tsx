import React from 'react';
import { FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-800">ГОСТ Форматирование</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/settings" 
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            title="Настройки"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;