import React, { useState, useEffect } from 'react';
import { quantifyImpact } from '../services/geminiService';
import { CloseIcon, LoadingIcon, SparklesIcon, CopyIcon, CheckIcon } from './icons';

interface ImpactQuantifierModalProps {
  bulletPoint: string;
  onClose: () => void;
  onApply: (newText: string) => void;
}

export const ImpactQuantifierModal: React.FC<ImpactQuantifierModalProps> = ({ bulletPoint, onClose, onApply }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editedText, setEditedText] = useState(bulletPoint);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const result = await quantifyImpact(bulletPoint);
        setSuggestions(result);
      } catch (error) {
        console.error("Failed to get impact suggestions:", error);
        setSuggestions(["Could not get suggestions. Please try rephrasing."]);
      } finally {
        setIsLoading(false);
      }
    };

    if (bulletPoint) {
      fetchSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulletPoint]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <SparklesIcon className="w-6 h-6 text-primary-DEFAULT mr-2" />
            <h2 className="text-xl font-bold text-slate-800">Impact Quantifier AI</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><CloseIcon /></button>
        </div>
        
        <div className="p-6">
            <label className="block text-sm font-medium text-slate-600 mb-2">Your current achievement:</label>
            <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full p-2 border rounded-md bg-slate-50"
                rows={3}
            />
            
            <div className="mt-4">
                <h3 className="font-semibold text-slate-700 mb-2">AI Suggestions to Add Metrics:</h3>
                {isLoading ? (
                    <div className="flex items-center text-slate-500">
                        <LoadingIcon />
                        <span>Analyzing and generating suggestions...</span>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {suggestions.map((s, i) => (
                           <li key={i} className="flex items-center justify-between p-3 bg-primary-light rounded-md text-slate-700">
                              <span>{s}</span>
                              <button onClick={() => handleCopy(s, i)} className="text-primary-DEFAULT hover:text-primary-hover">
                                {copiedIndex === i ? <CheckIcon className="text-green-500" /> : <CopyIcon />}
                              </button>
                           </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
        
        <div className="p-4 bg-slate-50 rounded-b-xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border rounded-md text-slate-700 hover:bg-slate-100">Cancel</button>
          <button onClick={() => onApply(editedText)} className="px-4 py-2 bg-primary-DEFAULT text-white rounded-md hover:bg-primary-hover">Apply Changes</button>
        </div>
      </div>
    </div>
  );
};
