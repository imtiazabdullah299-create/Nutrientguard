
import React, { useState, useRef } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import { NutritionData } from '../types';

interface AIVisionProps {
  onResult: (data: NutritionData) => void;
}

const AIVision: React.FC<AIVisionProps> = ({ onResult }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        try {
          const result = await analyzeFoodImage(base64Data);
          onResult(result);
        } catch (err: any) {
          setError(err.message || "Something went wrong during analysis.");
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError("Failed to read image file.");
        setLoading(false);
      };
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[300px] relative overflow-hidden">
      {loading ? (
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-emerald-600 font-medium text-center">
            Our AI is analyzing your food...<br/>
            <span className="text-slate-400 text-sm font-normal">Identifying dish and portion size</span>
          </p>
        </div>
      ) : (
        <>
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-slate-800 mb-2">Snap your meal</h2>
          <p className="text-slate-500 text-center mb-8 max-w-[240px]">
            Capture an image of your food and we'll handle the nutrition calculation for you.
          </p>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="group relative overflow-hidden px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Open Camera
            </span>
          </button>

          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleCapture}
          />

          {error && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIVision;
