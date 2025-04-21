import React, { useState, useRef } from 'react';
import { useDocumentContext } from '../../context/DocumentContext';
import { ArrowUp, ArrowDown, Trash2, Edit, Check, X, Plus, Minus, Image, Upload } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface SectionEditorProps {
  section: {
    id: string;
    type: 'text' | 'figure' | 'table' | 'formula';
    title?: string;
    content: string;
  };
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section }) => {
  const { updateSection, deleteSection, moveSection } = useDocumentContext();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(section.title || '');
  const [content, setContent] = useState(section.content);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize tableData with a default 3x3 grid
  const [tableData, setTableData] = useState<string[][]>(() => {
    // Default empty table structure
    const defaultTable = Array(3).fill(null).map((_, rowIndex) => 
      Array(3).fill(null).map((_, colIndex) => 
        rowIndex === 0 ? `Заголовок ${colIndex + 1}` : `Ячейка ${rowIndex}-${colIndex + 1}`
      )
    );

    // Only attempt to parse existing content if this is a table section
    if (section.type === 'table' && section.content) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(section.content, 'text/html');
        const rows = Array.from(doc.querySelectorAll('tr'));
        if (rows.length > 0) {
          return rows.map(row => 
            Array.from(row.querySelectorAll('td, th')).map(cell => cell.textContent || '')
          );
        }
      } catch (error) {
        console.error('Failed to parse table content:', error);
      }
    }
    
    return defaultTable;
  });
  
  const handleTitleUpdate = () => {
    setIsEditingTitle(false);
    updateSection(section.id, { title, content });
  };
  
  const handleContentChange = (value: string) => {
    setContent(value);
    updateSection(section.id, { title, content: value });
  };

  const generateTableHtml = (data: string[][]) => {
    let tableHtml = '<table style="width:100%; border-collapse: collapse;">';
    
    // Header row
    tableHtml += '<thead><tr>';
    for (let j = 0; j < data[0].length; j++) {
      tableHtml += `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f8f9fa;">${data[0][j]}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    
    // Data rows
    for (let i = 1; i < data.length; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < data[i].length; j++) {
        tableHtml += `<td style="border: 1px solid #ddd; padding: 8px;">${data[i][j]}</td>`;
      }
      tableHtml += '</tr>';
    }
    
    tableHtml += '</tbody></table>';
    return tableHtml;
  };

  const updateTableDimensions = (newRows: number, newCols: number) => {
    const newData = Array(newRows).fill(null).map((_, i) => 
      Array(newCols).fill(null).map((_, j) => {
        if (i < tableData.length && j < tableData[0].length) {
          return tableData[i][j];
        }
        return i === 0 ? `Заголовок ${j + 1}` : `Ячейка ${i}-${j + 1}`;
      })
    );
    
    setRows(newRows);
    setCols(newCols);
    setTableData(newData);
    const newTableHtml = generateTableHtml(newData);
    handleContentChange(newTableHtml);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = tableData.map((row, i) =>
      row.map((cell, j) => (i === rowIndex && j === colIndex ? value : cell))
    );
    setTableData(newData);
    const newTableHtml = generateTableHtml(newData);
    handleContentChange(newTableHtml);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleContentChange(`<div class="text-center"><img src="${imageUrl}" alt="Рисунок" style="max-width: 100%; height: auto;" /></div>`);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const getSectionIcon = () => {
    switch (section.type) {
      case 'text':
        return null;
      case 'figure':
        return <span className="text-blue-600">📊</span>;
      case 'table':
        return <span className="text-green-600">📋</span>;
      case 'formula':
        return <span className="text-purple-600">Σ</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {getSectionIcon()}
          
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleTitleUpdate}
                className="p-1 text-green-600 hover:text-green-800"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsEditingTitle(false)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-800">
                {section.title || `Раздел ${section.id}`}
              </h3>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => moveSection(section.id, 'up')}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Переместить вверх"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => moveSection(section.id, 'down')}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Переместить вниз"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteSection(section.id)}
            className="p-1 text-red-400 hover:text-red-600"
            title="Удалить раздел"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {section.type === 'text' && (
          <ReactQuill
            theme="snow"
            value={content}
            onChange={handleContentChange}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link'],
                ['clean']
              ]
            }}
          />
        )}
        
        {section.type === 'figure' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                <span>Загрузить с компьютера</span>
              </button>
              <button
                onClick={() => {
                  const imageUrl = prompt('Введите URL изображения:');
                  if (imageUrl) {
                    handleContentChange(`<div class="text-center"><img src="${imageUrl}" alt="Рисунок" style="max-width: 100%; height: auto;" /></div>`);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Image className="h-4 w-4" />
                <span>Добавить по ссылке</span>
              </button>
            </div>
            
            {content && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div dangerouslySetInnerHTML={{ __html: content }} />
                <input
                  type="text"
                  placeholder="Подпись к рисунку"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    const caption = e.target.value;
                    const imgMatch = content.match(/<img[^>]+>/);
                    if (imgMatch) {
                      handleContentChange(`<div class="text-center">${imgMatch[0]}<p class="mt-2 text-sm text-gray-600">${caption}</p></div>`);
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
        
        {section.type === 'table' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Строки:</span>
                <button
                  onClick={() => updateTableDimensions(Math.max(2, rows - 1), cols)}
                  className="p-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{rows}</span>
                <button
                  onClick={() => updateTableDimensions(rows + 1, cols)}
                  className="p-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Столбцы:</span>
                <button
                  onClick={() => updateTableDimensions(rows, Math.max(2, cols - 1))}
                  className="p-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{cols}</span>
                <button
                  onClick={() => updateTableDimensions(rows, cols + 1)}
                  className="p-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {tableData[0].map((cell, j) => (
                      <th key={j} className="border border-gray-300 p-2 bg-gray-50">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => handleCellChange(0, j, e.target.value)}
                          className="w-full bg-transparent border-none focus:outline-none font-medium"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(1).map((row, i) => (
                    <tr key={i + 1}>
                      {row.map((cell, j) => (
                        <td key={j} className="border border-gray-300 p-2">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => handleCellChange(i + 1, j, e.target.value)}
                            className="w-full border-none focus:outline-none"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {section.type === 'formula' && (
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-md flex items-center">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Введите формулу (например: Y=f(x))"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
              />
              <div className="ml-4 px-3 py-2 border-l border-gray-200">
                <span className="text-sm">(1)</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">Формула будет выровнена по центру, а номер - по правому краю</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionEditor;