import React, { useState } from 'react';
import { ResumeData } from '../types';
import { analyzeJobDescription } from '../services/geminiService';
import { CloseIcon, LoadingIcon, SparklesIcon } from './icons';
import ReactMarkdown from 'react-markdown';


interface JobMatchModalProps {
  resumeData: ResumeData;
  onClose: () => void;
}

interface AnalysisResult {
    matchScore: number;
    analysis: string;
}

export const JobMatchModal: React.FC<JobMatchModalProps> = ({ resumeData, onClose }) => {
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      alert("Please paste a job description.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
        const resumeText = JSON.stringify(resumeData, null, 2);
        const analysisResult = await analyzeJobDescription(resumeText, jdText);
        setResult(analysisResult);
    } catch (error) {
        console.error("Failed to analyze job description:", error);
        alert("An error occurred during analysis. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
      if (score > 75) return 'text-green-500 bg-green-100';
      if (score > 50) return 'text-yellow-500 bg-yellow-100';
      return 'text-red-500 bg-red-100';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all flex flex-col" style={{height: '90vh'}}>
        <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
          <div className="flex items-center">
            <SparklesIcon className="w-6 h-6 text-primary-DEFAULT mr-2" />
            <h2 className="text-xl font-bold text-slate-800">Job Description Match Analysis</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><CloseIcon /></button>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="jd" className="block text-sm font-medium text-slate-700 mb-2">Paste Job Description Here</label>
                <textarea
                    id="jd"
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    className="w-full h-64 p-2 border rounded-md bg-slate-50 resize-none"
                    placeholder="Paste the full job description from a site like LinkedIn or Indeed."
                />
                <button onClick={handleAnalyze} disabled={isLoading} className="mt-4 w-full px-4 py-2 bg-primary-DEFAULT text-white rounded-md hover:bg-primary-hover disabled:bg-slate-400 flex items-center justify-center">
                    {isLoading ? <><LoadingIcon /> Analyzing...</> : "Analyze Resume Match"}
                </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border overflow-y-auto">
                 <h3 className="font-semibold text-slate-700 mb-2 text-lg">Analysis Report</h3>
                 {isLoading && (
                     <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <LoadingIcon className="w-10 h-10"/>
                        <p className="mt-2">AI is reading your resume and the job description...</p>
                     </div>
                 )}
                 {result && (
                     <div>
                         <div className="text-center mb-4">
                            <p className="text-sm text-slate-600">Match Score</p>
                            <p className={`text-5xl font-bold ${getScoreColor(result.matchScore)} rounded-full w-24 h-24 flex items-center justify-center mx-auto`}>{result.matchScore}%</p>
                         </div>
                         <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-slate-800 prose-ul:list-disc prose-ul:ml-5">
                            <ReactMarkdown>{result.analysis}</ReactMarkdown>
                         </div>
                     </div>
                 )}
                 {!isLoading && !result && (
                     <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
                        <p>Your analysis report will appear here after you paste a job description and click analyze.</p>
                     </div>
                 )}
            </div>
        </div>
        
        <div className="p-4 bg-slate-100 rounded-b-xl flex justify-end gap-3 flex-shrink-0 border-t">
          <button onClick={onClose} className="px-6 py-2 bg-white border rounded-md text-slate-700 hover:bg-slate-200">Close</button>
        </div>
      </div>
    </div>
  );
};
