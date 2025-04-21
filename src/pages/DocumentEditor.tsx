import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import TitlePageEditor from '../components/document/TitlePageEditor';
import SectionEditor from '../components/document/SectionEditor';
import DocumentPreview from '../components/document/DocumentPreview';
import { useDocumentContext } from '../context/DocumentContext';
import { Plus, Download, LayoutPanelLeft, Eye } from 'lucide-react';
import DocumentExport from '../components/document/DocumentExport';

const DocumentEditor: React.FC = () => {
  const { document, addSection } = useDocumentContext();
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{document.title}</h1>
          <p className="text-sm text-gray-500">Редактор документа</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView(activeView === 'edit' ? 'preview' : 'edit')}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {activeView === 'edit' ? (
              <>
                <Eye className="h-4 w-4" />
                <span>Предпросмотр</span>
              </>
            ) : (
              <>
                <LayoutPanelLeft className="h-4 w-4" />
                <span>Редактировать</span>
              </>
            )}
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            <span>Экспорт</span>
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-auto ${activeView === 'edit' ? '' : 'hidden'}`}>
        <Tabs defaultValue="title" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="title">Титульный лист</TabsTrigger>
            <TabsTrigger value="content">Содержание</TabsTrigger>
          </TabsList>
          
          <TabsContent value="title" className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <TitlePageEditor />
          </TabsContent>
          
          <TabsContent value="content">
            <div className="space-y-4">
              {document.sections.map((section) => (
                <SectionEditor key={section.id} section={section} />
              ))}
              
              <div className="flex justify-center py-4">
                <div className="inline-flex rounded-md" role="group">
                  <button
                    onClick={() => addSection('text')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-l-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Текст</span>
                  </button>
                  <button
                    onClick={() => addSection('figure')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-t border-b border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Рисунок</span>
                  </button>
                  <button
                    onClick={() => addSection('table')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-t border-b border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Таблица</span>
                  </button>
                  <button
                    onClick={() => addSection('formula')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-r-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Формула</span>
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className={`flex-1 overflow-auto ${activeView === 'preview' ? '' : 'hidden'}`}>
        <DocumentPreview />
      </div>
      
      {/* Hidden preview for PDF export */}
      <div className="hidden">
        <DocumentPreview />
      </div>
      
      {showExportModal && (
        <DocumentExport onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
};

export default DocumentEditor;