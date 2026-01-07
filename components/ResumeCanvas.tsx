
import React from 'react';
import { CVData, CVSection, LayoutType } from '../types.ts';
import { Trash2, ArrowUp, ArrowDown, Globe, Mail, Phone, MapPin } from 'lucide-react';

interface ResumeCanvasProps {
  data: CVData;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onDelete: (id: string) => void;
}

export const ResumeCanvas: React.FC<ResumeCanvasProps> = ({ 
  data, selectedId, onSelect, onMove, onDelete
}) => {
  return (
    <div id="resume-canvas-content" className={`resume-page w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[15mm] flex flex-col relative transition-all duration-300 mx-auto ${
      data.layout === 'COMPACT' ? 'gap-y-3' : 'gap-y-6'
    }`}>
      {data.sections.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-xl font-medium">Your canvas is empty</p>
          <p className="text-sm mt-2">Start by adding components from the sidebar</p>
        </div>
      )}

      {data.sections.map((section, index) => (
        <SectionWrapper 
          key={section.id} 
          section={section}
          layout={data.layout}
          isSelected={selectedId === section.id}
          onSelect={() => onSelect(section.id)}
          onMoveUp={() => onMove(section.id, 'up')}
          onMoveDown={() => onMove(section.id, 'down')}
          onDelete={() => onDelete(section.id)}
          isFirst={index === 0}
          isLast={index === data.sections.length - 1}
        />
      ))}
    </div>
  );
};

interface SectionWrapperProps {
  section: CVSection;
  layout: LayoutType;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  section, layout, isSelected, onSelect, onMoveUp, onMoveDown, onDelete, isFirst, isLast
}) => {
  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      className={`group relative p-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50/10 shadow-sm' : 'hover:bg-slate-50'
      }`}
    >
      <div className={`no-print absolute -left-12 top-0 flex flex-col gap-1 transition-opacity ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst} className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm"><ArrowUp size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast} className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm"><ArrowDown size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 bg-white border border-red-100 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 shadow-sm"><Trash2 size={14} /></button>
      </div>
      <div className="relative">{renderSectionContent(section, layout)}</div>
    </div>
  );
};

const SectionTitle = ({ children, isClassic, isMinimal }: { children?: React.ReactNode; isClassic: boolean; isMinimal: boolean }) => (
  <h2 className={`text-sm font-bold text-slate-900 uppercase tracking-widest pb-1 mb-3 ${
    isClassic ? 'border-b border-slate-300 text-center' : 
    isMinimal ? 'border-b border-slate-100' : 'border-b-2 border-indigo-500'
  }`}>
    {children}
  </h2>
);

const renderSectionContent = (section: CVSection, layout: LayoutType) => {
  const isCompact = layout === 'COMPACT';
  const isClassic = layout === 'CLASSIC';
  const isMinimal = layout === 'MINIMAL';

  switch (section.type) {
    case 'HEADER':
      const h = section.data;
      if (isClassic) return (
        <div className="text-center mb-4">
          <h1 className="text-4xl font-serif font-bold text-slate-900 pb-2 border-b-2 border-slate-900 inline-block px-12 mb-4">{h.name}</h1>
          <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
            {h.location && <span>{h.location}</span>}
            {h.phone && <span>• {h.phone}</span>}
            {h.email && <span>• {h.email}</span>}
            {h.website && <span>• {h.website}</span>}
          </div>
          <p className="text-sm font-bold text-slate-800 mt-2 italic tracking-[0.2em] uppercase">{h.title}</p>
        </div>
      );
      if (isMinimal) return (
        <div className="mb-4 flex justify-between items-end border-b-2 border-slate-100 pb-6">
          <div>
            <h1 className="text-4xl font-light text-slate-900 tracking-tighter">{h.name}</h1>
            <p className="text-xl text-slate-400 font-normal mt-1">{h.title}</p>
          </div>
          <div className="text-right text-[10px] text-slate-500 font-medium space-y-1">
            {h.email && <div className="flex items-center justify-end gap-2">{h.email} <Mail size={10}/></div>}
            {h.phone && <div className="flex items-center justify-end gap-2">{h.phone} <Phone size={10}/></div>}
            {h.location && <div className="flex items-center justify-end gap-2">{h.location} <MapPin size={10}/></div>}
          </div>
        </div>
      );
      return (
        <div className={`text-center ${isCompact ? 'mb-2' : 'mb-6'}`}>
          <h1 className={`${isCompact ? 'text-3xl' : 'text-5xl'} font-black text-slate-900 tracking-tight leading-none mb-2`}>{h.name}</h1>
          <p className={`${isCompact ? 'text-lg' : 'text-2xl'} text-indigo-600 font-bold uppercase tracking-wide`}>{h.title}</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-6 text-xs font-semibold text-slate-600">
            {h.email && <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm"><Mail size={12} className="text-indigo-400" /> {h.email}</span>}
            {h.phone && <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm"><Phone size={12} className="text-indigo-400" /> {h.phone}</span>}
            {h.website && <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm"><Globe size={12} className="text-indigo-400" /> {h.website}</span>}
          </div>
        </div>
      );
    
    case 'SUMMARY':
      return (
        <div className={isCompact ? 'mb-2' : 'mb-4'}>
          <SectionTitle isClassic={isClassic} isMinimal={isMinimal}>{section.title}</SectionTitle>
          <p className={`text-slate-700 leading-relaxed whitespace-pre-wrap ${isCompact ? 'text-xs' : 'text-sm'}`}>{section.data}</p>
        </div>
      );

    case 'EXPERIENCE':
      return (
        <div className={isCompact ? 'mb-2' : 'mb-4'}>
          <SectionTitle isClassic={isClassic} isMinimal={isMinimal}>{section.title}</SectionTitle>
          <div className={isCompact ? 'space-y-3' : 'space-y-6'}>
            {section.data.map((exp: any, i: number) => (
              <div key={exp.id || i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-black text-slate-900 ${isCompact ? 'text-sm' : 'text-base'}`}>{exp.position}</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className={`font-bold text-indigo-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>{exp.company}</p>
                  {exp.location && <p className="text-[10px] text-slate-400 font-medium italic">{exp.location}</p>}
                </div>
                <p className={`text-slate-700 whitespace-pre-wrap leading-relaxed ${isCompact ? 'text-[11px]' : 'text-sm'}`}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'EDUCATION':
      return (
        <div className={isCompact ? 'mb-2' : 'mb-4'}>
          <SectionTitle isClassic={isClassic} isMinimal={isMinimal}>{section.title}</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            {section.data.map((edu: any, i: number) => (
              <div key={edu.id || i} className="flex justify-between items-start">
                <div>
                  <h3 className={`font-bold text-slate-900 ${isCompact ? 'text-sm' : 'text-base'}`}>{edu.degree}</h3>
                  <p className={`text-indigo-600 font-semibold ${isCompact ? 'text-[11px]' : 'text-sm'}`}>{edu.school}</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{edu.startDate} — {edu.endDate}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'PROJECTS':
      return (
        <div className={isCompact ? 'mb-2' : 'mb-4'}>
          <SectionTitle isClassic={isClassic} isMinimal={isMinimal}>{section.title}</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            {section.data.map((proj: any, i: number) => (
              <div key={proj.id || i}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold text-slate-900 ${isCompact ? 'text-sm' : 'text-base'}`}>{proj.name}</h3>
                  {proj.link && <a href={proj.link} className="text-[10px] text-indigo-500 font-bold hover:underline flex items-center gap-1">Link <Globe size={10}/></a>}
                </div>
                <p className={`text-slate-700 leading-relaxed ${isCompact ? 'text-[11px]' : 'text-sm'}`}>{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'SKILLS':
      return (
        <div className={isCompact ? 'mb-2' : 'mb-4'}>
          <SectionTitle isClassic={isClassic} isMinimal={isMinimal}>{section.title}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {section.data.map((skill: string, i: number) => (
              <span key={i} className={`px-3 py-1 font-bold rounded shadow-sm border ${
                isMinimal ? 'bg-transparent border-slate-200 text-slate-500 text-[10px]' : 
                'bg-slate-900 text-white text-[11px] border-slate-900'
              }`}>{skill}</span>
            ))}
          </div>
        </div>
      );

    default: return <div>Section unknown</div>;
  }
};
