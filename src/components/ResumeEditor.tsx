import React, { useState } from 'react';
import { ResumeData, Experience, Education, Project } from '../types';
import ResumePreview from './ResumePreview';
import EditableInput from './EditableInput';
import { AddIcon, DeleteIcon, SparklesIcon, JobIcon, DownloadIcon, ResetIcon } from './icons';
import { v4 as uuidv4 } from 'uuid';
import { ImpactQuantifierModal } from './ImpactQuantifierModal';
import { JobMatchModal } from './JobMatchModal';

interface ResumeEditorProps {
  initialData: ResumeData;
  onReset: () => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ initialData, onReset }) => {
  const [data, setData] = useState<ResumeData>(initialData);
  // FIX: Changed path type from `string[] | number[]` to `(string | number)[]` to allow mixed types in the array.
  const [quantifierModal, setQuantifierModal] = useState<{ open: boolean; content: string; path: (string | number)[] }>({ open: false, content: '', path: [] });
  const [jobMatchModalOpen, setJobMatchModalOpen] = useState(false);

  const handleUpdate = <T,>(section: keyof ResumeData, index: number, field: keyof T, value: string) => {
    const sectionData = data[section] as T[];
    const updatedSection = [...sectionData];
    updatedSection[index] = { ...updatedSection[index], [field]: value };
    setData(prev => ({ ...prev, [section]: updatedSection }));
  };
  
  const handleSimpleUpdate = (field: keyof ResumeData, value: string) => {
    setData(prev => ({...prev, [field]: value}));
  }

  const handleSkillsUpdate = (field: keyof ResumeData['skills'], value: string) => {
    setData(prev => ({ ...prev, skills: { ...prev.skills, [field]: value } }));
  };

  const addToArray = (section: 'experience' | 'education' | 'projects') => {
    const newItem: Experience | Education | Project = section === 'experience'
      ? { id: uuidv4(), role: '', company: '', location: '', startDate: '', endDate: '', description: [''] }
      : section === 'education'
      ? { id: uuidv4(), degree: '', university: '', location: '', startDate: '', endDate: '', gpa: '' }
      : { id: uuidv4(), name: '', technologies: '', description: [''] };
    
    setData(prev => ({ ...prev, [section]: [...(prev[section] as any), newItem] }));
  };

  const removeFromArray = (section: 'experience' | 'education' | 'projects', id: string) => {
    setData(prev => ({...prev, [section]: (prev[section] as any[]).filter(item => item.id !== id)}));
  };

  const handleBulletUpdate = (section: 'experience' | 'projects', itemIndex: number, bulletIndex: number, value: string) => {
    const sectionData = data[section] as (Experience | Project)[];
    const updatedItems = [...sectionData];
    const updatedBullets = [...updatedItems[itemIndex].description];
    updatedBullets[bulletIndex] = value;
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], description: updatedBullets };
    setData(prev => ({ ...prev, [section]: updatedItems }));
  };

  const addBullet = (section: 'experience' | 'projects', itemIndex: number) => {
    const sectionData = data[section] as (Experience | Project)[];
    const updatedItems = [...sectionData];
    updatedItems[itemIndex].description.push('');
    setData(prev => ({ ...prev, [section]: updatedItems }));
  };
  
  const removeBullet = (section: 'experience' | 'projects', itemIndex: number, bulletIndex: number) => {
    const sectionData = data[section] as (Experience | Project)[];
    const updatedItems = [...sectionData];
    const updatedBullets = updatedItems[itemIndex].description.filter((_, i) => i !== bulletIndex);
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], description: updatedBullets };
    setData(prev => ({ ...prev, [section]: updatedItems }));
  };

  const openQuantifier = (content: string, path: (string|number)[]) => {
    setQuantifierModal({ open: true, content, path });
  };
  
  const handleQuantifierApply = (newText: string) => {
    const [section, itemIndex, bulletIndex] = quantifierModal.path as ['experience' | 'projects', number, number];
    handleBulletUpdate(section, itemIndex, bulletIndex, newText);
    setQuantifierModal({open: false, content: '', path: []});
  }


  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="w-full lg:w-1/2 p-6 lg:p-10 bg-white overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <header className="flex justify-between items-center mb-8 pb-4 border-b">
          <div className="flex items-center">
            <SparklesIcon className="w-8 h-8 text-primary-DEFAULT" />
            <h1 className="text-3xl font-bold text-slate-800 ml-2">CareerCraft Editor</h1>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setJobMatchModalOpen(true)} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-100 transition">
              <JobIcon className="w-5 h-5" /> Job Match
            </button>
            <button onClick={onReset} className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 transition">
              <ResetIcon className="w-5 h-5" /> Start Fresh
            </button>
          </div>
        </header>

        {/* Form Sections */}
        <Section title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableInput label="Full Name" value={data.name} onChange={v => handleSimpleUpdate('name', v)} />
                <EditableInput label="Email" value={data.email} onChange={v => handleSimpleUpdate('email', v)} type="email"/>
                <EditableInput label="Phone" value={data.phone} onChange={v => handleSimpleUpdate('phone', v)} type="tel"/>
                <EditableInput label="LinkedIn" value={data.linkedin} onChange={v => handleSimpleUpdate('linkedin', v)} />
                <EditableInput label="GitHub" value={data.github} onChange={v => handleSimpleUpdate('github', v)} />
                <EditableInput label="Portfolio" value={data.portfolio} onChange={v => handleSimpleUpdate('portfolio', v)} />
            </div>
        </Section>
        
        <Section title="Professional Summary">
            <EditableInput label="Summary" value={data.summary} onChange={v => handleSimpleUpdate('summary', v)} type="textarea" />
        </Section>
        
        <Section title="Work Experience">
            {data.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 bg-slate-50 rounded-lg mb-4 border">
                    <div className="flex justify-end">
                        <button onClick={() => removeFromArray('experience', exp.id)} className="text-red-500 hover:text-red-700"><DeleteIcon /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <EditableInput label="Role" value={exp.role} onChange={v => handleUpdate<Experience>('experience', index, 'role', v)} />
                        <EditableInput label="Company" value={exp.company} onChange={v => handleUpdate<Experience>('experience', index, 'company', v)} />
                        <EditableInput label="Location" value={exp.location} onChange={v => handleUpdate<Experience>('experience', index, 'location', v)} />
                        <EditableInput label="Start Date" value={exp.startDate} onChange={v => handleUpdate<Experience>('experience', index, 'startDate', v)} />
                        <EditableInput label="End Date" value={exp.endDate} onChange={v => handleUpdate<Experience>('experience', index, 'endDate', v)} />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                        {exp.description.map((bullet, bIndex) => (
                            <div key={bIndex} className="flex items-center gap-2 mb-2">
                                <span className="text-primary-DEFAULT font-bold text-xl">&#8226;</span>
                                <div className="flex-grow">
                                  <EditableInput placeholder="Describe your achievement..." value={bullet} onChange={v => handleBulletUpdate('experience', index, bIndex, v)} type="textarea" small/>
                                </div>
                                <button onClick={() => openQuantifier(bullet, ['experience', index, bIndex])} className="text-primary-DEFAULT hover:text-primary-hover"><SparklesIcon /></button>
                                <button onClick={() => removeBullet('experience', index, bIndex)} className="text-red-500 hover:text-red-700"><DeleteIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                         <button onClick={() => addBullet('experience', index)} className="text-sm text-primary-DEFAULT hover:text-primary-hover flex items-center gap-1 mt-2"><AddIcon className="w-4 h-4"/> Add Bullet Point</button>
                    </div>
                </div>
            ))}
            <button onClick={() => addToArray('experience')} className="mt-2 w-full text-center bg-primary-light text-primary-DEFAULT py-2 rounded-lg hover:bg-sky-100 transition flex items-center justify-center gap-2">
              <AddIcon/> Add Experience
            </button>
        </Section>
        
        <Section title="Education">
            {data.education.map((edu, index) => (
                <div key={edu.id} className="p-4 bg-slate-50 rounded-lg mb-4 border">
                    <div className="flex justify-end">
                        <button onClick={() => removeFromArray('education', edu.id)} className="text-red-500 hover:text-red-700"><DeleteIcon /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <EditableInput label="Degree / Certificate" value={edu.degree} onChange={v => handleUpdate<Education>('education', index, 'degree', v)} />
                        <EditableInput label="University / Institution" value={edu.university} onChange={v => handleUpdate<Education>('education', index, 'university', v)} />
                        <EditableInput label="Location" value={edu.location} onChange={v => handleUpdate<Education>('education', index, 'location', v)} />
                        <EditableInput label="Start Date" value={edu.startDate} onChange={v => handleUpdate<Education>('education', index, 'startDate', v)} />
                        <EditableInput label="End Date" value={edu.endDate} onChange={v => handleUpdate<Education>('education', index, 'endDate', v)} />
                        <EditableInput label="GPA / Grade" value={edu.gpa} onChange={v => handleUpdate<Education>('education', index, 'gpa', v)} />
                    </div>
                </div>
            ))}
            <button onClick={() => addToArray('education')} className="mt-2 w-full text-center bg-primary-light text-primary-DEFAULT py-2 rounded-lg hover:bg-sky-100 transition flex items-center justify-center gap-2">
              <AddIcon/> Add Education
            </button>
        </Section>

        <Section title="Projects">
            {data.projects.map((proj, index) => (
                <div key={proj.id} className="p-4 bg-slate-50 rounded-lg mb-4 border">
                    <div className="flex justify-end">
                        <button onClick={() => removeFromArray('projects', proj.id)} className="text-red-500 hover:text-red-700"><DeleteIcon /></button>
                    </div>
                    <EditableInput label="Project Name" value={proj.name} onChange={v => handleUpdate<Project>('projects', index, 'name', v)} />
                    <EditableInput label="Technologies Used" value={proj.technologies} onChange={v => handleUpdate<Project>('projects', index, 'technologies', v)} placeholder="e.g., React, Node.js, AWS"/>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                        {proj.description.map((bullet, bIndex) => (
                             <div key={bIndex} className="flex items-center gap-2 mb-2">
                                <span className="text-primary-DEFAULT font-bold text-xl">&#8226;</span>
                                <div className="flex-grow">
                                  <EditableInput placeholder="Describe your achievement..." value={bullet} onChange={v => handleBulletUpdate('projects', index, bIndex, v)} type="textarea" small/>
                                </div>
                                <button onClick={() => openQuantifier(bullet, ['projects', index, bIndex])} className="text-primary-DEFAULT hover:text-primary-hover"><SparklesIcon /></button>
                                <button onClick={() => removeBullet('projects', index, bIndex)} className="text-red-500 hover:text-red-700"><DeleteIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                        <button onClick={() => addBullet('projects', index)} className="text-sm text-primary-DEFAULT hover:text-primary-hover flex items-center gap-1 mt-2"><AddIcon className="w-4 h-4"/> Add Bullet Point</button>
                    </div>
                </div>
            ))}
             <button onClick={() => addToArray('projects')} className="mt-2 w-full text-center bg-primary-light text-primary-DEFAULT py-2 rounded-lg hover:bg-sky-100 transition flex items-center justify-center gap-2">
              <AddIcon/> Add Project
            </button>
        </Section>

        <Section title="Skills">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableInput label="Languages" value={data.skills.languages} onChange={v => handleSkillsUpdate('languages', v)} placeholder="e.g., TypeScript, Python"/>
                <EditableInput label="Frameworks & Runtimes" value={data.skills.frameworks} onChange={v => handleSkillsUpdate('frameworks', v)} placeholder="e.g., React, Node.js" />
                <EditableInput label="Developer Tools" value={data.skills.developerTools} onChange={v => handleSkillsUpdate('developerTools', v)} placeholder="e.g., Git, Docker, AWS" />
                <EditableInput label="Libraries" value={data.skills.libraries} onChange={v => handleSkillsUpdate('libraries', v)} placeholder="e.g., Redux, D3.js" />
            </div>
        </Section>

      </div>
      <div className="w-full lg:w-1/2 p-6 lg:p-10 bg-slate-100/70 flex flex-col items-center">
        <ResumePreview data={data} />
      </div>
      {quantifierModal.open && 
        <ImpactQuantifierModal 
            bulletPoint={quantifierModal.content} 
            onClose={() => setQuantifierModal({open: false, content: '', path: []})}
            onApply={handleQuantifierApply}
            />
        }
      {jobMatchModalOpen &&
        <JobMatchModal
          resumeData={data}
          onClose={() => setJobMatchModalOpen(false)}
        />
      }
    </div>
  );
};


const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-bold text-slate-700 mb-4 pb-2 border-b-2 border-primary-DEFAULT">{title}</h2>
        {children}
    </section>
);


export default ResumeEditor;
