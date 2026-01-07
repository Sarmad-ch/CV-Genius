
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResumeCanvas } from './components/ResumeCanvas';
import { Editor } from './components/Editor';
import { CVData, CVSection, SectionType, LayoutType } from './types';
import { 
  FileText, 
  Download, 
  Layout, 
  Sparkles, 
  RotateCcw,
  Layers
} from 'lucide-react';

const INITIAL_DATA: CVData = {
  layout: 'MODERN',
  sections: [
    {
      id: 'header-1',
      type: 'HEADER',
      title: 'Contact Information',
      data: {
        name: 'John Doe',
        title: 'Senior Software Engineer',
        email: 'john.doe@example.com',
        phone: '+1 (555) 000-0000',
        location: 'San Francisco, CA',
        website: 'linkedin.com/in/johndoe'
      }
    },
    {
      id: 'summary-1',
      type: 'SUMMARY',
      title: 'Professional Summary',
      data: 'Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and Cloud Architecture.'
    }
  ]
};

export default function App() {
  const [cvData, setCvData] = useState<CVData>(INITIAL_DATA);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const addSection = (type: SectionType) => {
    const newSection: CVSection = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      title: type.charAt(0) + type.slice(1).toLowerCase(),
      data: type === 'EXPERIENCE' || type === 'EDUCATION' || type === 'PROJECTS' ? [] : 
            type === 'SKILLS' ? ['React', 'TypeScript', 'Node.js'] : ''
    };
    setCvData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setSelectedSectionId(newSection.id);
  };

  const removeSection = (id: string) => {
    setCvData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
    if (selectedSectionId === id) setSelectedSectionId(null);
  };

  const updateSection = (id: string, newData: any) => {
    setCvData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, data: newData } : s)
    }));
  };

  const setLayout = (layout: LayoutType) => {
    setCvData(prev => ({ ...prev, layout }));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = cvData.sections.findIndex(s => s.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cvData.sections.length - 1) return;

    const newSections = [...cvData.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    setCvData(prev => ({ ...prev, sections: newSections }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Navbar */}
      <header className="no-print h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <FileText size={22} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            CV-Genius
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            {(['MODERN', 'CLASSIC', 'MINIMAL', 'COMPACT'] as LayoutType[]).map((l) => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  cvData.layout === l 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {l.charAt(0) + l.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCvData(INITIAL_DATA)}
              className="p-2 text-slate-400 hover:text-slate-600 transition-all"
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-95"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Component Library */}
        <div className="no-print w-72 shrink-0 border-r border-slate-200 bg-white flex flex-col p-6 overflow-y-auto">
          <Sidebar onAddSection={addSection} />
        </div>

        {/* Center: Resume Canvas */}
        <main className="flex-1 overflow-y-auto p-12 bg-slate-100 custom-scrollbar flex justify-center items-start">
          <ResumeCanvas 
            data={cvData} 
            selectedId={selectedSectionId}
            onSelect={setSelectedSectionId}
            onMove={moveSection}
            onDelete={removeSection}
          />
        </main>

        {/* Right: Property Editor */}
        <div className="no-print w-96 shrink-0 border-l border-slate-200 bg-white flex flex-col p-6 overflow-y-auto">
          {selectedSectionId ? (
            <Editor 
              section={cvData.sections.find(s => s.id === selectedSectionId)!}
              onUpdate={(data) => updateSection(selectedSectionId, data)}
              onClose={() => setSelectedSectionId(null)}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="p-4 bg-slate-50 rounded-full text-slate-400">
                <Layout size={32} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700">No Section Selected</h3>
                <p className="text-sm text-slate-500 mt-1">Select a section on the canvas to edit its properties or use the sidebar to add new components.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Indicator */}
      <div className="md:hidden fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center">
        <Sparkles className="w-16 h-16 text-indigo-600 mb-6" />
        <h2 className="text-2xl font-bold mb-4">Desktop Experience Recommended</h2>
        <p className="text-slate-600">For the best drag-and-drop building experience, please use a tablet or desktop computer.</p>
      </div>
    </div>
  );
}
