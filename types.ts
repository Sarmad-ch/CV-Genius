
export type SectionType = 'HEADER' | 'SUMMARY' | 'EXPERIENCE' | 'EDUCATION' | 'SKILLS' | 'PROJECTS';
export type LayoutType = 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'COMPACT';

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface CVHeader {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
}

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  data: any;
}

export interface CVData {
  sections: CVSection[];
  layout: LayoutType;
}
