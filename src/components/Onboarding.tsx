import React, { useRef, ChangeEvent } from 'react';
import { parseResumeContent } from '../services/geminiService';
import { ResumeData } from '../types';
import { FileIcon, SparklesIcon, BuildIcon, LoadingIcon } from './icons';

interface OnboardingProps {
  onResumeParsed: (data: ResumeData) => void;
  onBuildFromScratch: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onResumeParsed, onBuildFromScratch, isLoading, setIsLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        // Result is "data:[<mime-type>];base64,<data>"
        const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
        const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);

        const parsedData = await parseResumeContent(base64Data, mimeType);
        if (parsedData) {
            onResumeParsed(parsedData);
        } else {
            alert("AI parsing failed. Please try again or build from scratch.");
        }
      } catch (error) {
        console.error("Error parsing resume:", error);
        alert("An error occurred while parsing your resume. Please check the file and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 max-w-2xl mx-auto">
        <div className="flex justify-center items-center mb-4">
          <SparklesIcon className="w-12 h-12 text-primary-DEFAULT" />
          <h1 className="text-5xl font-bold text-slate-800 ml-3">CareerCraft AI</h1>
        </div>
        <p className="text-lg text-secondary mb-10">
          The intelligent resume builder for top-tier tech roles. Let our AI quantify your impact, optimize for ATS, and craft the perfect resume to land your dream job at a MAANG-level company.
        </p>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center bg-white p-10 rounded-xl shadow-lg-blue border border-slate-200">
            <LoadingIcon className="w-12 h-12 text-primary-DEFAULT" />
            <p className="mt-4 text-lg font-semibold text-slate-700">AI is crafting your draft...</p>
            <p className="text-slate-500">Parsing experience, quantifying achievements, and structuring your new resume.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={handleUploadClick}
              className="group flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg-blue border border-slate-200 hover:border-primary-DEFAULT hover:shadow-2xl transition-all duration-300"
            >
              <FileIcon className="w-16 h-16 mb-4 text-primary-DEFAULT group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-semibold text-slate-800">Upload Existing Resume</h2>
              <p className="text-secondary mt-2">Let our AI parse your PDF/DOCX/TXT file and create an optimized draft in seconds.</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.docx,.txt"
              />
            </button>
            <button
              onClick={onBuildFromScratch}
              className="group flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg-blue border border-slate-200 hover:border-primary-DEFAULT hover:shadow-2xl transition-all duration-300"
            >
              <BuildIcon className="w-16 h-16 mb-4 text-primary-DEFAULT group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-semibold text-slate-800">Build From Scratch</h2>
              <p className="text-secondary mt-2">Use our guided editor with MAANG-approved examples to build a powerful resume from the ground up.</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
