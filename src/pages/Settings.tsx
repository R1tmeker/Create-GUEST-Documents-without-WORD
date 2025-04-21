import React, { useState } from 'react';
import { useDocumentContext } from '../context/DocumentContext';

const Settings: React.FC = () => {
  const { documentSettings, updateSettings } = useDocumentContext();
  const [settings, setSettings] = useState(documentSettings);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateSettings(settings);
    alert('Настройки сохранены');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Настройки документа</h1>
        <p className="text-sm text-gray-600">Настройте параметры форматирования документа</p>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Шрифт */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Шрифт основного текста
            </label>
            <select
              name="fontFamily"
              value={settings.fontFamily}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Times New Roman">Times New Roman</option>
              <option value="Arial">Arial</option>
            </select>
          </div>
          
          {/* Размер шрифта */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Размер шрифта
            </label>
            <select
              name="fontSize"
              value={settings.fontSize}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="14">14</option>
            </select>
          </div>
          
          {/* Междустрочный интервал */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Междустрочный интервал
            </label>
            <select
              name="lineSpacing"
              value={settings.lineSpacing}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Одинарный</option>
              <option value="1.5">Полуторный</option>
              <option value="2">Двойной</option>
            </select>
          </div>
          
          {/* Отступ абзаца */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Отступ абзаца (см)
            </label>
            <input
              type="number"
              name="paragraphIndent"
              value={settings.paragraphIndent}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Интервалы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Интервал перед заголовком */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Интервал перед заголовком (пт)
              </label>
              <input
                type="number"
                name="headingSpaceBefore"
                value={settings.headingSpaceBefore}
                onChange={handleChange}
                min="0"
                max="30"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Интервал после заголовка */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Интервал после заголовка (пт)
              </label>
              <input
                type="number"
                name="headingSpaceAfter"
                value={settings.headingSpaceAfter}
                onChange={handleChange}
                min="0"
                max="30"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Интервал перед рисунком */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Интервал перед рисунком (пт)
              </label>
              <input
                type="number"
                name="figureSpaceBefore"
                value={settings.figureSpaceBefore}
                onChange={handleChange}
                min="0"
                max="30"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Интервал после рисунка */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Интервал после рисунка (пт)
              </label>
              <input
                type="number"
                name="figureSpaceAfter"
                value={settings.figureSpaceAfter}
                onChange={handleChange}
                min="0"
                max="30"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Интервал перед таблицей */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Интервал перед таблицей (пт)
              </label>
              <input
                type="number"
                name="tableSpaceBefore"
                value={settings.tableSpaceBefore}
                onChange={handleChange}
                min="0"
                max="30"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Интервал после таблицы */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Интервал после таблицы (пт)
              </label>
              <input
                type="number"
                name="tableSpaceAfter"
                value={settings.tableSpaceAfter}
                onChange={handleChange}
                min="0"
                max="30"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t border-gray-200 flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Сохранить настройки
        </button>
      </div>
    </div>
  );
};

export default Settings;