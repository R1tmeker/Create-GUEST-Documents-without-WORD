import React, { useState, useEffect } from 'react';
import { useDocumentContext } from '../../context/DocumentContext';
import { FileText, FileOutput, X } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface DocumentExportProps {
  onClose: () => void;
}

const DocumentExport: React.FC<DocumentExportProps> = ({ onClose }) => {
  const { document: docData } = useDocumentContext();
  const [exportFormat, setExportFormat] = useState<'docx' | 'pdf'>('docx');
  const [isExporting, setIsExporting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadImage = async (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (!isClient) {
        reject(new Error('Cannot load image in non-browser environment'));
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const waitForImages = async (element: HTMLElement): Promise<void> => {
    if (!isClient) return;
    
    const images = Array.from(element.getElementsByTagName('img'));
    
    await Promise.all(
      images.map(async (img) => {
        if (img.complete) return;
        
        try {
          if (img.src.startsWith('data:')) {
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          } else {
            const loadedImg = await loadImage(img.src);
            img.src = loadedImg.src;
          }
        } catch (error) {
          console.error('Failed to load image:', error);
        }
      })
    );
  };

  const exportToPdf = async () => {
    if (!isClient) {
      throw new Error('Cannot export to PDF in non-browser environment');
    }

    const previewContent = document.getElementById('document-preview');
    if (!previewContent) {
      throw new Error('Preview content not found');
    }

    // Create a temporary container for the PDF content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.innerHTML = previewContent.innerHTML;
    document.body.appendChild(tempContainer);

    try {
      // Wait for all images to load
      await waitForImages(tempContainer);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Get all page elements
      const pages = tempContainer.children;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Process each page
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        // Set explicit dimensions for the page
        page.style.width = '210mm';
        page.style.minHeight = '297mm';
        page.style.margin = '0';
        page.style.padding = '20mm';
        page.style.boxSizing = 'border-box';
        page.style.backgroundColor = 'white';

        // Create canvas for the current page
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          windowWidth: 793.7007874, // 210mm at 96dpi
          windowHeight: 1122.519685 // 297mm at 96dpi
        });

        // Add new page if not first page
        if (i > 0) {
          pdf.addPage();
        }

        // Add image to PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(
          imgData,
          'JPEG',
          0,
          0,
          pageWidth,
          pageHeight,
          undefined,
          'FAST'
        );
      }

      return pdf;
    } finally {
      // Clean up
      document.body.removeChild(tempContainer);
    }
  };

  const createDocxDocument = () => {
    const children = [];

    const titlePageContent = [
      {
        text: "Министерство науки и высшего образования Российской Федерации",
        spacing: { before: 0, after: 240 }
      },
      {
        text: "федеральное государственное бюджетное образовательное учреждение",
        spacing: { before: 240, after: 0 }
      },
      {
        text: "высшего образования",
        spacing: { before: 0, after: 240 }
      },
      {
        text: "«Алтайский государственный технический университет им. И.И. Ползунова»",
        spacing: { before: 240, after: 480 }
      },
      {
        text: "Университетский технологический колледж",
        spacing: { before: 240, after: 240 }
      },
      {
        text: "Кафедра Информационные системы в экономике",
        spacing: { before: 240, after: 0 }
      },
      {
        text: "Направление Информационные системы и программирование",
        spacing: { before: 0, after: 480 }
      },
      {
        text: `Отчёт защищен с оценкой_________`,
        spacing: { before: 240, after: 240 },
        alignment: AlignmentType.RIGHT
      },
      {
        text: docData.titlePage.studentName,
        spacing: { before: 240, after: 480 },
        alignment: AlignmentType.RIGHT
      },
      {
        text: "ОТЧЁТ",
        spacing: { before: 480, after: 240 },
        bold: true
      },
      {
        text: "по лабораторной работе №*",
        spacing: { before: 240, after: 240 }
      },
      {
        text: docData.titlePage.workTitle,
        spacing: { before: 240, after: 240 },
        bold: true
      },
      {
        text: `по дисциплине ${docData.titlePage.discipline}`,
        spacing: { before: 240, after: 240 }
      },
      {
        text: docData.titlePage.documentCode,
        spacing: { before: 240, after: 960 }
      }
    ];

    titlePageContent.forEach(item => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.text,
              size: 28,
              bold: item.bold || false
            })
          ],
          alignment: item.alignment || AlignmentType.CENTER,
          spacing: item.spacing
        })
      );
    });

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Студент группы ${docData.titlePage.groupNumber}`, size: 24 })
        ],
        alignment: AlignmentType.LEFT,
        spacing: { before: 240, after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "В.В. Хромин", size: 24 })
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { before: 0, after: 480 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Руководитель работы", size: 24 })
        ],
        alignment: AlignmentType.LEFT,
        spacing: { before: 240, after: 0 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "преподаватель", size: 24 })
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { before: 0, after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: docData.titlePage.teacherName, size: 24 })
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { before: 240, after: 720 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Барнаул ${docData.titlePage.year}`, size: 24 })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 0 }
      })
    );

    children.push(
      new Paragraph({
        children: [new TextRun({ break: 1 })],
        pageBreakBefore: true
      })
    );

    docData.sections.forEach(section => {
      if (section.title) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: section.title, bold: true, size: 28 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 240 }
          })
        );
      }

      if (section.type === 'text') {
        const cleanText = section.content.replace(/<[^>]+>/g, '');
        children.push(
          new Paragraph({
            children: [new TextRun({ text: cleanText, size: 24 })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 240, after: 240 },
            indent: { firstLine: 720 }
          })
        );
      } else if (section.type === 'table' && isClient) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(section.content, 'text/html');
        const rows = doc.querySelectorAll('tr');
        
        const tableRows = Array.from(rows).map(row => {
          const cells = row.querySelectorAll('td, th');
          return new TableRow({
            children: Array.from(cells).map(cell => 
              new TableCell({
                children: [new Paragraph({ 
                  children: [new TextRun({ text: cell.textContent || '', size: 24 })],
                  spacing: { before: 120, after: 120 }
                })],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
                margins: {
                  top: 120,
                  bottom: 120,
                  left: 120,
                  right: 120
                }
              })
            ),
          });
        });

        if (tableRows.length > 0) {
          children.push(
            new Table({
              rows: tableRows,
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
            })
          );
        }
      }
    });

    return new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1008,
              bottom: 1440,
              left: 2016,
            }
          }
        },
        children: children,
      }],
    });
  };

  const handleExport = async () => {
    if (!isClient) {
      console.error('Cannot export in non-browser environment');
      return;
    }

    try {
      setIsExporting(true);

      if (exportFormat === 'docx') {
        const doc = createDocxDocument();
        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const pdf = await exportToPdf();
        pdf.save('document.pdf');
      }

      setIsExporting(false);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      alert('Ошибка при экспорте документа. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Экспорт документа</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-sm text-gray-500 mb-4">
            Выберите формат экспорта для вашего документа
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center text-center ${
                exportFormat === 'docx' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setExportFormat('docx')}
            >
              <FileText className="h-10 w-10 text-blue-500 mb-2" />
              <span className="font-medium">DOCX</span>
              <span className="text-xs text-gray-500">Документ Microsoft Word</span>
            </div>
            
            <div
              className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center text-center ${
                exportFormat === 'pdf' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setExportFormat('pdf')}
            >
              <FileOutput className="h-10 w-10 text-red-500 mb-2" />
              <span className="font-medium">PDF</span>
              <span className="text-xs text-gray-500">Portable Document Format</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            
            <button
              onClick={handleExport}
              disabled={isExporting || !isClient}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white ${
                isExporting || !isClient ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Экспорт...</span>
                </>
              ) : (
                <>
                  <FileOutput className="h-4 w-4" />
                  <span>Экспортировать</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentExport;