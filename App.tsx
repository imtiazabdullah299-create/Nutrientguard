
import React, { useState, useEffect } from 'react';
import { AppMode, NutritionData, LogEntry } from './types';
import AIVision from './components/AIVision';
import ManualEntry from './components/ManualEntry';
import NutritionSummary from './components/NutritionSummary';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.AI_DETECTION);
  const [currentResult, setCurrentResult] = useState<NutritionData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load logs from local storage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('nutrientguard_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  const saveLog = () => {
    if (!currentResult) return;
    const newEntry: LogEntry = {
      ...currentResult,
      timestamp: Date.now()
    };
    const updatedLogs = [newEntry, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('nutrientguard_logs', JSON.stringify(updatedLogs));
    setCurrentResult(null);
  };

  const totals = logs.reduce((acc, log) => {
    // Only count logs from last 24 hours for daily summary
    if (Date.now() - log.timestamp < 24 * 60 * 60 * 1000) {
      acc.calories += log.calories;
      acc.protein += log.protein;
      acc.carbs += log.carbs;
      acc.fats += log.fats;
    }
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">NutrientGuard</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Healthy Living Tracker</p>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {logs.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>}
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8 space-y-8">
        {/* Daily Summary Stats */}
        {!currentResult && !showHistory && (
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors duration-500"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-slate-400 font-medium text-sm">Today's Consumption</h2>
                  <p className="text-4xl font-black tracking-tighter mt-1">{totals.calories} <span className="text-xl font-normal text-slate-500">kcal</span></p>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-xl backdrop-blur-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 p-3 rounded-2xl backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Protein</p>
                  <p className="font-bold">{totals.protein}g</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Carbs</p>
                  <p className="font-bold">{totals.carbs}g</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Fats</p>
                  <p className="font-bold">{totals.fats}g</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode Toggle */}
        {!currentResult && !showHistory && (
          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
            <button 
              onClick={() => setMode(AppMode.AI_DETECTION)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${mode === AppMode.AI_DETECTION ? 'bg-white shadow-md text-emerald-700 scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Live AI
            </button>
            <button 
              onClick={() => setMode(AppMode.MANUAL_ENTRY)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${mode === AppMode.MANUAL_ENTRY ? 'bg-white shadow-md text-emerald-700 scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Manual Entry
            </button>
          </div>
        )}

        {/* Dynamic Content Area */}
        {showHistory ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">History</h2>
              <button onClick={() => setShowHistory(false)} className="text-emerald-600 font-bold text-sm">Back to Home</button>
            </div>
            <div className="space-y-3">
              {logs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400">No logs recorded yet.</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">{log.foodName}</h4>
                      <p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleDateString()} • {log.portionSize}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-600">{log.calories} kcal</p>
                      <p className="text-[10px] text-slate-400 font-medium">P:{log.protein}g C:{log.carbs}g F:{log.fats}g</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <>
            {!currentResult ? (
              <div className="animate-in fade-in duration-500">
                {mode === AppMode.AI_DETECTION ? (
                  <AIVision onResult={setCurrentResult} />
                ) : (
                  <ManualEntry onFoodSelected={setCurrentResult} />
                )}
              </div>
            ) : (
              <NutritionSummary 
                data={currentResult} 
                onClear={() => setCurrentResult(null)} 
                onSave={saveLog}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Action Hint */}
      {!currentResult && !showHistory && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 shadow-xl flex items-center gap-3 animate-bounce">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">
            {mode === AppMode.AI_DETECTION ? 'Detecting active...' : 'Offline database ready'}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
