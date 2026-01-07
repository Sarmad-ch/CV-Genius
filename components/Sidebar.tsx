
import React from 'react';
import { SectionType } from '../types.ts';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  ClipboardList, 
  Quote,
  LayoutGrid
} from 'lucide-react';

interface SidebarProps {
  onAddSection: (type: SectionType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddSection }) => {
  const components: { type: SectionType; icon: React.ReactNode; label: string; desc: string }[] = [
    { type: 'HEADER', icon: <User size={18} />, label: 'Header', desc: 'Contact details and title' },
    { type: 'SUMMARY', icon: <Quote size={18} />, label: 'Summary', desc: 'Professional bio' },
    { type: 'EXPERIENCE', icon: <Briefcase size={18} />, label: 'Experience', desc: 'Work history and roles' },
    { type: 'EDUCATION', icon: <GraduationCap size={18} />, label: 'Education', desc: 'Degrees and certifications' },
    { type: 'SKILLS', icon: <Wrench size={18} />, label: 'Skills', desc: 'Technical and soft skills' },
    { type: 'PROJECTS', icon: <ClipboardList size={18} />, label: 'Projects', desc: 'Key work accomplishments' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <LayoutGrid size={12} />
          Components
        </h2>
        <div className="grid gap-3">
          {components.map((comp) => (
            <button
              key={comp.type}
              onClick={() => onAddSection(comp.type)}
              className="group flex flex-col items-start p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all duration-200 text-left active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {comp.icon}
                </div>
                <span className="font-semibold text-sm text-slate-700">{comp.label}</span>
              </div>
              <p className="text-xs text-slate-500 pl-11">{comp.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
        <h4 className="text-xs font-bold text-indigo-700 uppercase mb-2">Pro Tip</h4>
        <p className="text-xs text-indigo-600 leading-relaxed">
          The Gemini AI assistant can automatically improve your descriptions. Just click the magic wand icon in the editor!
        </p>
      </div>
    </div>
  );
};
