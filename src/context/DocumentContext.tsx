import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface DocumentSettings {
  fontFamily: string;
  fontSize: string;
  lineSpacing: string;
  paragraphIndent: string;
  headingSpaceBefore: string;
  headingSpaceAfter: string;
  figureSpaceBefore: string;
  figureSpaceAfter: string;
  tableSpaceBefore: string;
  tableSpaceAfter: string;
}

export interface TitlePageData {
  studentName: string;
  groupNumber: string;
  workTitle: string;
  discipline: string;
  documentCode: string;
  year: string;
  teacherName: string;
}

export interface DocumentSection {
  id: string;
  type: 'text' | 'figure' | 'table' | 'formula';
  content: string;
  title?: string;
}

export interface DocumentState {
  title: string;
  titlePage: TitlePageData;
  sections: DocumentSection[];
  settings: DocumentSettings;
}

interface DocumentContextType {
  document: DocumentState;
  documentSettings: DocumentSettings;
  updateTitlePage: (data: Partial<TitlePageData>) => void;
  updateSettings: (settings: DocumentSettings) => void;
  addSection: (sectionType: DocumentSection['type'], title?: string) => void;
  updateSection: (id: string, data: { title?: string; content: string }) => void;
  deleteSection: (id: string) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
}

const defaultSettings: DocumentSettings = {
  fontFamily: 'Times New Roman',
  fontSize: '14',
  lineSpacing: '1.5',
  paragraphIndent: '1.25',
  headingSpaceBefore: '10',
  headingSpaceAfter: '10',
  figureSpaceBefore: '10',
  figureSpaceAfter: '6',
  tableSpaceBefore: '6',
  tableSpaceAfter: '10',
};

const defaultTitlePage: TitlePageData = {
  studentName: 'А.С. Пушкин',
  groupNumber: '1ИСП-21',
  workTitle: 'Система учета посещаемости',
  discipline: 'Объектно-ориентированное программирование',
  documentCode: '09.02.07.28.001',
  year: '2025',
  teacherName: 'К.В. Воробьев',
};

const initialDocument: DocumentState = {
  title: 'Новый документ',
  titlePage: defaultTitlePage,
  sections: [
    {
      id: 'intro',
      type: 'text',
      title: 'Цели и задачи работы',
      content: '<p>Введите цели и задачи работы...</p>'
    },
    {
      id: 'theory',
      type: 'text',
      title: 'Теоретическое описание',
      content: '<p>Введите теоретическое описание...</p>'
    },
    {
      id: 'practice',
      type: 'text',
      title: 'Практическая реализация',
      content: '<p>Введите описание практической реализации...</p>'
    },
    {
      id: 'conclusion',
      type: 'text',
      title: 'Выводы',
      content: '<p>Введите выводы по работе...</p>'
    },
    {
      id: 'questions',
      type: 'text',
      title: 'Ответы на контрольные вопросы',
      content: '<p>Введите ответы на контрольные вопросы...</p>'
    }
  ],
  settings: defaultSettings,
};

const DocumentContext = createContext<DocumentContextType | null>(null);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [document, setDocument] = useState<DocumentState>(initialDocument);

  const updateTitlePage = (data: Partial<TitlePageData>) => {
    setDocument(prev => ({
      ...prev,
      titlePage: {
        ...prev.titlePage,
        ...data
      }
    }));
  };

  const updateSettings = (settings: DocumentSettings) => {
    setDocument(prev => ({
      ...prev,
      settings
    }));
  };

  const addSection = (sectionType: DocumentSection['type'], title?: string) => {
    const newSection: DocumentSection = {
      id: `section-${Date.now()}`,
      type: sectionType,
      title: title || '',
      content: ''
    };
    
    setDocument(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (id: string, data: { title?: string; content: string }) => {
    setDocument(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === id ? { ...section, ...data } : section
      )
    }));
  };

  const deleteSection = (id: string) => {
    setDocument(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== id)
    }));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const sections = [...document.sections];
    const index = sections.findIndex(section => section.id === id);
    
    if (direction === 'up' && index > 0) {
      [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
    }
    
    setDocument(prev => ({
      ...prev,
      sections
    }));
  };

  return (
    <DocumentContext.Provider
      value={{
        document,
        documentSettings: document.settings,
        updateTitlePage,
        updateSettings,
        addSection,
        updateSection,
        deleteSection,
        moveSection
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};