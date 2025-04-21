import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Форматирование документов по ГОСТ
        </h1>
        <p className="text-gray-600">
          Создавайте отчеты по лабораторным работам и статьи для конференций с автоматическим форматированием по ГОСТ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Создать документ</h2>
              <p className="text-sm text-gray-600">Начните работу с нового документа</p>
            </div>
            <div className="bg-blue-50 rounded-full p-2">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Link
            to="/editor"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
          >
            <Plus className="h-4 w-4" />
            <span>Создать документ</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Настройки</h2>
              <p className="text-sm text-gray-600">Настройте параметры форматирования</p>
            </div>
            <div className="bg-blue-50 rounded-full p-2">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Link
            to="/settings"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors w-full"
          >
            <Settings className="h-4 w-4" />
            <span>Настроить</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">О программе</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            Программа разработана для автоматического форматирования документов согласно требованиям ГОСТ и издательств.
          </p>
          <p>Основные функции:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Создание титульного листа с настраиваемыми полями</li>
            <li>Форматирование текста в соответствии с ГОСТ</li>
            <li>Добавление таблиц и рисунков со сквозной нумерацией</li>
            <li>Добавление формул со сквозной нумерацией</li>
            <li>Настройка шрифтов, отступов и интервалов</li>
            <li>Экспорт в форматы DOCX и PDF</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;