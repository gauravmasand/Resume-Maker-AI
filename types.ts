
export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  university: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  technologies: string;
  description: string[];
}

export interface Skills {
  languages: string;
  frameworks: string;
  developerTools: string;
  libraries: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skills;
}
