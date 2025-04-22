import React from 'react';
import { useDocumentContext } from '../../context/DocumentContext';

const TitlePageEditor: React.FC = () => {
  const { document, updateTitlePage } = useDocumentContext();
  const { titlePage } = document;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateTitlePage({ [name]: value });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Настройки титульного листа
        </h2>
        <p className="text-sm text-gray-600">
          Заполните данные для генерации титульного листа
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ФИО студента
          </label>
          <input
            type="text"
            name="studentName"
            value={titlePage.studentName}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Фамилия И.О."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Группа
          </label>
          <input
            type="text"
            name="groupNumber"
            value={titlePage.groupNumber}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Номер группы"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название работы
          </label>
          <input
            type="text"
            name="workTitle"
            value={titlePage.workTitle}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Название лабораторной работы или статьи"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дисциплина
          </label>
          <input
            type="text"
            name="discipline"
            value={titlePage.discipline}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Название дисциплины"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Шифр документа
          </label>
          <input
            type="text"
            name="documentCode"
            value={titlePage.documentCode}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Шифр документа"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Год
          </label>
          <input
            type="text"
            name="year"
            value={titlePage.year}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Год выполнения"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ФИО преподавателя
          </label>
          <input
            type="text"
            name="teacherName"
            value={titlePage.teacherName}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Фамилия И.О."
          />
        </div>
      </div>
      
      <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Предпросмотр</h3>
        <div className="bg-white p-6 border border-gray-300 text-center text-sm" style={{ lineHeight: 1.5 }}>
          <p className="mb-2">Министерство науки и высшего образования Российской Федерации</p>
          <p className="mb-2">федеральное государственное бюджетное образовательное учреждение<br />высшего образования</p>
          <p className="mb-3">«Алтайский государственный технический университет им. И.И. Ползунова»</p>
          
          <p className="mb-1">Университетский технологический колледж</p>
          <p className="text-[10pt] text-gray-500">наименование подразделения</p>
          
          <p className="mb-1">Кафедра Информационные системы в экономике</p>
          <p className="text-[10pt] text-gray-500 mb-2">наименование кафедры</p>
          
          <p className="mb-4">Направление Информационные системы и программирование</p>
          
          <div className="flex justify-end mb-16">
            <div className="text-right">
              <p>Отчёт защищен с оценкой_________</p>
              <p className="mt-2">______________   {titlePage.teacherName}</p>
              <p className="text-[10pt] text-gray-500">(подпись руководителя от вуза) (инициалы, фамилия)</p>
              <p className="mt-2">"___"_______________2025г.</p>
            </div>
          </div>
          
          <p className="text-lg font-bold mb-2">ОТЧЕТ</p>
          <p className="mb-1">по лабораторной работе №*</p>
          <p className="mb-1">{titlePage.workTitle}</p>
          <p className="text-[10pt] text-gray-500 mb-2">тема лабораторной работы</p>
          <p className="mb-1">по дисциплине {titlePage.discipline}</p>
          <p className="mb-4">{titlePage.documentCode}</p>
          <p className="text-[10pt] text-gray-500">обозначение документа</p>
          
          <div className="flex justify-between mt-16">
            <div className="text-left flex-1">
              <p>Студент группы {titlePage.groupNumber}</p>
            </div>
            <div className="text-right flex-1">
              <p>{titlePage.studentName}</p>
              <p className="text-[10pt] text-gray-500">инициалы, фамилия</p>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <div className="text-left flex-1">
              <p>Руководитель работы</p>
              <p className="text-[10pt] text-gray-500">должность, учёное звание</p>
            </div>
            <div className="text-right flex-1">
              <p>{titlePage.teacherName}</p>
              <p className="text-[10pt] text-gray-500">инициалы, фамилия</p>
            </div>
          </div>
          
          <p className="mt-16">Барнаул {titlePage.year}</p>
        </div>
      </div>
    </div>
  );
};

export default TitlePageEditor;