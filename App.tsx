
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResumeCanvas } from './components/ResumeCanvas';
import { Editor } from './components/Editor';
import { CVData, CVSection, SectionType, LayoutType } from './types';
import { 
  FileText, 
  Download, 
  Layout as LayoutIcon, 
  Sparkles, 
  RotateCcw,
  Loader2,
  CheckCircle
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
    },
    {
      id: 'exp-1',
      type: 'EXPERIENCE',
      title: 'Work Experience',
      data: [
        {
          id: 'item-1',
          company: 'Tech Solutions Inc.',
          position: 'Lead Developer',
          location: 'Remote',
          startDate: 'Jan 2021',
          endDate: 'Present',
          description: 'Architected and implemented high-traffic microservices.'
        }
      ]
    }
  ]
};

export default function App() {
  const [cvData, setCvData] = useState<CVData>(INITIAL_DATA);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const addSection = useCallback((type: SectionType) => {
    const newSection: CVSection = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      title: type === 'EXPERIENCE' ? 'Work Experience' : type.charAt(0) + type.slice(1).toLowerCase(),
      data: type === 'EXPERIENCE' || type === 'EDUCATION' || type === 'PROJECTS' ? [] : 
            type === 'SKILLS' ? ['React', 'TypeScript', 'Node.js'] : ''
    };
    setCvData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setSelectedSectionId(newSection.id);
  }, []);

  const removeSection = useCallback((id: string) => {
    setCvData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
    if (selectedSectionId === id) setSelectedSectionId(null);
  }, [selectedSectionId]);

  const updateSection = useCallback((id: string, newData: any) => {
    setCvData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, data: newData } : s)
    }));
  }, []);

  const setLayout = useCallback((layout: LayoutType) => {
    setCvData(prev => ({ ...prev, layout }));
  }, []);

  const moveSection = useCallback((id: string, direction: 'up' | 'down') => {
    const index = cvData.sections.findIndex(s => s.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cvData.sections.length - 1) return;

    const newSections = [...cvData.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    setCvData(prev => ({ ...prev, sections: newSections }));
  }, [cvData.sections]);

  const handleExport = () => {
    setIsExporting(true);
    setSelectedSectionId(null);
    // Give the UI a moment to hide focus rings and editors before printing
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 700);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      {/* Top Navigation */}
      <header className="no-print h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <FileText size={22} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
              CV-Genius <span className="text-indigo-600">AI</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Professional Builder</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            {(['MODERN', 'CLASSIC', 'MINIMAL', 'COMPACT'] as LayoutType[]).map((l) => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all duration-300 uppercase tracking-tighter ${
                  cvData.layout === l 
                    ? 'bg-white text-indigo-600 shadow-md scale-105' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-slate-200"></div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCvData(INITIAL_DATA)}
              className="p-2 text-slate-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-lg"
              title="Reset Content"
            >
              <RotateCcw size={18} />
            </button>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70 group"
            >
              {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />}
              {isExporting ? 'Preparing...' : 'Export PDF'}
            </button>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Component Library */}
        <aside className="no-print w-72 shrink-0 border-r border-slate-200 bg-white flex flex-col p-6 overflow-y-auto z-10 custom-scrollbar">
          <Sidebar onAddSection={addSection} />
        </aside>

        {/* Live Preview Canvas */}
        <main className="flex-1 overflow-y-auto p-12 bg-slate-100 custom-scrollbar flex justify-center items-start scroll-smooth">
          <div className="transform scale-[0.8] lg:scale-[0.9] xl:scale-100 origin-top transition-transform duration-500">
            <ResumeCanvas 
              data={cvData} 
              selectedId={selectedSectionId}
              onSelect={setSelectedSectionId}
              onMove={moveSection}
              onDelete={removeSection}
            />
          </div>
        </main>

        {/* Contextual Editor */}
        <aside className="no-print w-96 shrink-0 border-l border-slate-200 bg-white flex flex-col p-6 overflow-y-auto z-10 custom-scrollbar">
          {selectedSectionId ? (
            <Editor 
              section={cvData.sections.find(s => s.id === selectedSectionId)!}
              onUpdate={(data) => updateSection(selectedSectionId, data)}
              onClose={() => setSelectedSectionId(null)}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6 shadow-inner">
                <LayoutIcon size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Ready to Edit</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-[200px] leading-relaxed">Select any section on the resume to customize its content with AI assistance.</p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-green-100">
                <CheckCircle size={12} /> Auto-saving enabled
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Mobile Overlay */}
      <div className="md:hidden fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center">
        <Sparkles className="w-16 h-16 text-indigo-600 mb-6 animate-pulse" />
        <h2 className="text-2xl font-black mb-4 tracking-tight">Large Screen Required</h2>
        <p className="text-slate-500 text-sm leading-relaxed">This professional CV builder is optimized for desktop precision. Please switch to a larger device to continue building.</p>
      </div>
    </div>
  );
}
