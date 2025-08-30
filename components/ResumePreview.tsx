
import React, { useRef } from 'react';
import { ResumeData } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DownloadIcon } from './icons';

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const element = previewRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
    });
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${data.name.replace(' ', '_')}_Resume.pdf`);
  };

  const createLink = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="w-full flex justify-end mb-4">
        <button 
          onClick={handleDownloadPDF} 
          className="flex items-center gap-2 bg-primary-DEFAULT text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition shadow-lg-blue"
        >
          <DownloadIcon className="w-5 h-5"/> Download PDF
        </button>
      </div>
      <div ref={previewRef} className="bg-white p-10 w-[210mm] min-h-[297mm] shadow-2xl text-sm font-sans text-gray-800">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-wider">{data.name}</h1>
          <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs mt-2 flex-wrap">
            <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">{data.email}</a>
            <span>|</span>
            <span>{data.phone}</span>
            <span>|</span>
            <a href={createLink(data.linkedin)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{data.linkedin}</a>
            <span>|</span>
            <a href={createLink(data.github)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{data.github}</a>
            <span>|</span>
            <a href={createLink(data.portfolio)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{data.portfolio}</a>
          </div>
        </header>

        <section className="mb-4">
          <p className="text-justify">{data.summary}</p>
        </section>

        <PreviewSection title="Work Experience">
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base">{exp.role}</h3>
                <span className="text-xs font-medium">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline text-sm">
                <h4 className="font-semibold">{exp.company}</h4>
                <span className="text-xs italic">{exp.location}</span>
              </div>
              <ul className="list-disc list-outside ml-5 mt-1 space-y-1">
                {exp.description.map((item, i) => item && <li key={i} className="text-justify">{item}</li>)}
              </ul>
            </div>
          ))}
        </PreviewSection>
        
        <PreviewSection title="Education">
          {data.education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base">{edu.degree}</h3>
                <span className="text-xs font-medium">{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline text-sm">
                <h4 className="font-semibold">{edu.university}</h4>
                <span className="text-xs italic">{edu.location}</span>
              </div>
              {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </PreviewSection>

        <PreviewSection title="Projects">
          {data.projects.map(proj => (
            <div key={proj.id} className="mb-3">
               <h3 className="font-bold text-base">{proj.name}</h3>
               {proj.technologies && <p className="text-xs font-semibold italic mb-1">Technologies: {proj.technologies}</p>}
               <ul className="list-disc list-outside ml-5 mt-1 space-y-1">
                {proj.description.map((item, i) => item && <li key={i} className="text-justify">{item}</li>)}
              </ul>
            </div>
          ))}
        </PreviewSection>

        <PreviewSection title="Skills">
           <SkillLine label="Languages" skills={data.skills.languages} />
           <SkillLine label="Frameworks & Runtimes" skills={data.skills.frameworks} />
           <SkillLine label="Developer Tools" skills={data.skills.developerTools} />
           <SkillLine label="Libraries" skills={data.skills.libraries} />
        </PreviewSection>

      </div>
    </div>
  );
};

const PreviewSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-3">
    <h2 className="text-lg font-bold border-b-2 border-gray-300 mb-2 pb-1 uppercase tracking-wider">{title}</h2>
    {children}
  </section>
);

const SkillLine: React.FC<{label: string, skills: string}> = ({label, skills}) => (
    skills ? <p><span className="font-bold">{label}:</span> {skills}</p> : null
);

export default ResumePreview;
