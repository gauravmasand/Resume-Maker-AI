import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import ResumeEditor from './components/ResumeEditor';
import { ResumeData } from './types';
import { initialResumeData } from './constants';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResumeParsed = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleBuildFromScratch = () => {
    setResumeData(initialResumeData);
  };

  const handleReset = () => {
    setResumeData(null);
  }

  return (
    <div className="min-h-screen bg-slate-100/50">
      {resumeData ? (
        <ResumeEditor initialData={resumeData} onReset={handleReset} />
      ) : (
        <Onboarding 
          onResumeParsed={handleResumeParsed} 
          onBuildFromScratch={handleBuildFromScratch}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default App;
