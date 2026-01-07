
import React, { useState } from 'react';
import { CVSection, ExperienceItem, EducationItem } from '../types.ts';
import { optimizeContent } from '../services/geminiService.ts';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Loader2,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface EditorProps {
  section: CVSection;
  onUpdate: (data: any) => void;
  onClose: () => void;
}

const HeaderEditor: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
  const handleChange = (f: string, v: string) => onUpdate({ ...data, [f]: v });
  return (
    <div className="space-y-4">
      {['name', 'title', 'email', 'phone', 'location', 'website'].map((field) => (
        <div key={field}>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{field}</label>
          <input
            type="text"
            value={data[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder={`Enter ${field}...`}
          />
        </div>
      ))}
    </div>
  );
};

const SummaryEditor: React.FC<{ 
  data: string; 
  onUpdate: (data: string) => void; 
  isOptimizing: boolean; 
  onOptimize: (val: string) => void 
}> = ({ data, onUpdate, isOptimizing, onOptimize }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <label className="block text-[10px] font-bold text-slate-500 uppercase">Professional Summary</label>
      <button 
        onClick={() => onOptimize(data)}
        disabled={isOptimizing}
        className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
      >
        {isOptimizing ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
        AI Improve
      </button>
    </div>
    <textarea
      rows={8}
      value={data}
      onChange={(e) => onUpdate(e.target.value)}
      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none leading-relaxed"
      placeholder="Briefly describe your career goals and achievements..."
    />
  </div>
);

const ExperienceEditor: React.FC<{ 
  data: ExperienceItem[]; 
  onUpdate: (data: ExperienceItem[]) => void;
  isOptimizing: boolean;
  onOptimize: (idx: number, content: string) => void;
}> = ({ data, onUpdate, isOptimizing, onOptimize }) => {
  const addItem = () => {
    onUpdate([...data, {
      id: Date.now().toString(),
      company: '', position: '', location: '', startDate: '', endDate: '', description: ''
    }]);
  };
  const updateItem = (idx: number, field: string, val: string) => {
    const newList = [...data];
    newList[idx] = { ...newList[idx], [field]: val };
    onUpdate(newList);
  };
  const removeItem = (idx: number) => onUpdate(data.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      {data.map((item, i) => (
        <div key={item.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3 relative group/item shadow-sm">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-md transition-all opacity-0 group-hover/item:opacity-100"><Trash2 size={14} /></button>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={item.position} onChange={(e) => updateItem(i, 'position', e.target.value)} className="col-span-2 w-full px-2 py-1.5 border border-slate-200 rounded text-sm bg-white" placeholder="Position" />
            <input type="text" value={item.company} onChange={(e) => updateItem(i, 'company', e.target.value)} className="col-span-2 w-full px-2 py-1.5 border border-slate-200 rounded text-sm bg-white" placeholder="Company" />
            <input type="text" value={item.startDate} onChange={(e) => updateItem(i, 'startDate', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" placeholder="Start Date" />
            <input type="text" value={item.endDate} onChange={(e) => updateItem(i, 'endDate', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" placeholder="End Date" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
              <button onClick={() => onOptimize(i, item.description)} disabled={isOptimizing} className="flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                {isOptimizing ? <Loader2 className="animate-spin" size={10} /> : <Sparkles size={10} />} AI Improve
              </button>
            </div>
            <textarea rows={4} value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white resize-none" placeholder="Achievements..." />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all flex items-center justify-center gap-2 text-sm font-medium"><Plus size={16} /> Add Experience</button>
    </div>
  );
};

const EducationEditor: React.FC<{ data: EducationItem[]; onUpdate: (data: EducationItem[]) => void }> = ({ data, onUpdate }) => {
  const addItem = () => onUpdate([...data, { id: Date.now().toString(), school: '', degree: '', field: '', startDate: '', endDate: '' }]);
  const updateItem = (idx: number, field: string, val: string) => {
    const newList = [...data];
    newList[idx] = { ...newList[idx], [field]: val };
    onUpdate(newList);
  };
  const removeItem = (idx: number) => onUpdate(data.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={item.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3 relative group/item">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100"><Trash2 size={14} /></button>
          <input type="text" value={item.school} onChange={(e) => updateItem(i, 'school', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm bg-white" placeholder="School/University" />
          <input type="text" value={item.degree} onChange={(e) => updateItem(i, 'degree', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm bg-white" placeholder="Degree (e.g. B.Sc)" />
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={item.startDate} onChange={(e) => updateItem(i, 'startDate', e.target.value)} className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" placeholder="Start" />
            <input type="text" value={item.endDate} onChange={(e) => updateItem(i, 'endDate', e.target.value)} className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" placeholder="End" />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 text-xs font-bold"><Plus size={14} /> Add Education</button>
    </div>
  );
};

const ProjectsEditor: React.FC<{ data: any[]; onUpdate: (data: any[]) => void; isOptimizing: boolean; onOptimize: (idx: number, content: string) => void }> = ({ data, onUpdate, isOptimizing, onOptimize }) => {
  const addItem = () => onUpdate([...data, { id: Date.now().toString(), name: '', link: '', description: '' }]);
  const updateItem = (idx: number, field: string, val: string) => {
    const newList = [...data];
    newList[idx] = { ...newList[idx], [field]: val };
    onUpdate(newList);
  };
  const removeItem = (idx: number) => onUpdate(data.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={item.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2 relative group/item">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100"><Trash2 size={14} /></button>
          <input type="text" value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm font-bold bg-white" placeholder="Project Name" />
          <input type="text" value={item.link} onChange={(e) => updateItem(i, 'link', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" placeholder="Project Link (URL)" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Highlights</span>
            <button onClick={() => onOptimize(i, item.description)} disabled={isOptimizing} className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
               {isOptimizing ? <Loader2 className="animate-spin" size={10} /> : <Sparkles size={10} />} AI Improve
            </button>
          </div>
          <textarea rows={3} value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white resize-none" placeholder="Built using React..." />
        </div>
      ))}
      <button onClick={addItem} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 text-xs font-bold"><Plus size={14} /> Add Project</button>
    </div>
  );
};

const SkillsEditor: React.FC<{ data: string[]; onUpdate: (data: string[]) => void }> = ({ data, onUpdate }) => {
  const [newSkill, setNewSkill] = useState('');
  const list = Array.isArray(data) ? data : [];
  const addSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newSkill.trim()) return;
    onUpdate([...list, newSkill.trim()]);
    setNewSkill('');
  };
  const removeSkill = (idx: number) => onUpdate(list.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      <form onSubmit={addSkill} className="flex gap-2">
        <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Docker" />
        <button type="submit" className="px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"><Plus size={18} /></button>
      </form>
      <div className="flex flex-wrap gap-2">
        {list.map((skill, i) => (
          <div key={i} className="group flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 shadow-sm">
            {skill} <button onClick={() => removeSkill(i)} className="text-slate-300 hover:text-red-500"><X size={10} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Editor: React.FC<EditorProps> = ({ section, onUpdate, onClose }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleAIImproveGeneric = async (idx: number | null, currentVal: string) => {
    if (!currentVal) return;
    setIsOptimizing(true);
    try {
      const improved = await optimizeContent(currentVal, section.type.toLowerCase());
      if (idx === null) onUpdate(improved);
      else {
        const newList = [...section.data];
        newList[idx] = { ...newList[idx], description: improved };
        onUpdate(newList);
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const getEditor = () => {
    switch (section.type) {
      case 'HEADER': return <HeaderEditor data={section.data} onUpdate={onUpdate} />;
      case 'SUMMARY': return <SummaryEditor data={section.data} onUpdate={onUpdate} isOptimizing={isOptimizing} onOptimize={(v) => handleAIImproveGeneric(null, v)} />;
      case 'EXPERIENCE': return <ExperienceEditor data={section.data} onUpdate={onUpdate} isOptimizing={isOptimizing} onOptimize={handleAIImproveGeneric} />;
      case 'EDUCATION': return <EducationEditor data={section.data} onUpdate={onUpdate} />;
      case 'PROJECTS': return <ProjectsEditor data={section.data} onUpdate={onUpdate} isOptimizing={isOptimizing} onOptimize={handleAIImproveGeneric} />;
      case 'SKILLS': return <SkillsEditor data={section.data} onUpdate={onUpdate} />;
      default: return <p className="text-sm text-slate-400 italic">Editor for this section type is coming soon...</p>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
          Edit {section.title}
        </h2>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto pr-1">{getEditor()}</div>
      <div className="mt-8 pt-6 border-t border-slate-100">
        <button onClick={onClose} className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md shadow-slate-200 active:scale-[0.98]">Save Changes</button>
      </div>
    </div>
  );
};
