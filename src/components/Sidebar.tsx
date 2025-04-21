import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileEdit } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Home className="h-5 w-5" />
              <span>Главная</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/editor"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <FileEdit className="h-5 w-5" />
              <span>Редактор</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;