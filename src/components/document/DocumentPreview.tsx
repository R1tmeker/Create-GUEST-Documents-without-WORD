import React from 'react';
import { useDocumentContext } from '../../context/DocumentContext';

const DocumentPreview: React.FC = () => {
  const { document } = useDocumentContext();
  const { titlePage, sections } = document;

  const getSectionNumber = (type: string, currentIndex: number) => {
    let count = 1;
    sections.forEach((section, index) => {
      if (section.type === type && index < currentIndex) {
        count++;
      }
    });
    return count;
  };

  return (
    <div id="document-preview" className="max-w-[210mm] mx-auto bg-white shadow-sm border border-gray-200 p-[20mm] min-h-[297mm]" style={{ fontSize: '14pt', lineHeight: 1.5, fontFamily: 'Times New Roman' }}>
      {/* Title Page */}
      <div className="mb-[297mm]">
        <div className="text-center">
          <p className="mb-4">Министерство науки и высшего образования Российской Федерации</p>
          <p className="mb-4">федеральное государственное бюджетное образовательное учреждение<br />высшего образования</p>
          <p className="mb-6">«Алтайский государственный технический университет им. И.И. Ползунова»</p>
          
          <p className="mb-4">Университетский технологический колледж</p>
          
          <p className="mb-2">Кафедра Информационные системы в экономике</p>
          <p className="mb-4">Направление Информационные системы и программирование</p>
          
          <div className="flex justify-end mb-4 text-right">
            <div>
              <p>Отчёт защищен с оценкой_________</p>
              <p className="mt-4">{titlePage.studentName}</p>
              <p className="text-xs text-gray-500">подпись руководителя и дата подписания</p>
            </div>
          </div>
          
          <h2 className="text-lg font-bold mt-12 mb-2">ОТЧЁТ</h2>
          <p className="mb-2">по лабораторной работе №*</p>
          <p className="mb-4 font-bold">{titlePage.workTitle}</p>
          <p className="mb-2">по дисциплине {titlePage.discipline}</p>
          <p className="mb-8 text-xs">{titlePage.documentCode}</p>
          
          <div className="flex justify-between mt-16">
            <div className="text-left">
              <p>Студент группы {titlePage.groupNumber}</p>
              <p className="text-xs text-gray-500">подпись, фамилия</p>
            </div>
            <div className="text-right">
              <p>В.В. Хромин</p>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <div className="text-left">
              <p>Руководитель работы</p>
              <p className="text-xs text-gray-500">должность, учёное звание</p>
            </div>
            <div className="text-right">
              <p>преподаватель</p>
            </div>
          </div>
          
          <div className="flex justify-end mt-2">
            <div className="text-right">
              <p>{titlePage.teacherName}</p>
              <p className="text-xs text-gray-500">подпись, фамилия</p>
            </div>
          </div>
          
          <p className="mt-16">Барнаул {titlePage.year}</p>
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={section.id} className="mb-6">
            {section.title && (
              <h2 className="text-lg font-bold mb-4 text-center">{section.title}</h2>
            )}
            
            {section.type === 'text' && (
              <div 
                className="text-justify"
                style={{ textIndent: '1.25cm' }}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            )}
            
            {section.type === 'figure' && (
              <div className="my-4 text-center">
                <div className="mb-2"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
                <p className="text-sm text-left">
                  <span className="font-medium">Рисунок {getSectionNumber('figure', index)} – </span>
                  Название рисунка
                </p>
              </div>
            )}
            
            {section.type === 'table' && (
              <div className="my-4">
                <p className="text-sm text-left mb-2">
                  <span className="font-medium">Таблица {getSectionNumber('table', index)} – </span>
                  Название таблицы
                </p>
                <div className="border border-gray-300"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            )}
            
            {section.type === 'formula' && (
              <div className="my-4 flex justify-between items-center">
                <div className="flex-1 text-center">{section.content}</div>
                <div className="text-right">({getSectionNumber('formula', index)})</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentPreview;