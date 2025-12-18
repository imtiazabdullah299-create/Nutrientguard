
import React from 'react';
import { NutritionData } from '../types';

interface NutritionSummaryProps {
  data: NutritionData;
  onClear: () => void;
  onSave: () => void;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ data, onClear, onSave }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center">
        <h3 className="text-white font-bold text-xl">{data.foodName}</h3>
        <span className="text-emerald-100 text-sm bg-emerald-700/50 px-3 py-1 rounded-full">
          {data.portionSize}
        </span>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center">
            <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Calories</span>
            <span className="text-2xl font-black text-slate-800">{data.calories}</span>
            <span className="text-slate-400 text-[10px]">kcal</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center">
            <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Protein</span>
            <span className="text-2xl font-black text-blue-600">{data.protein}g</span>
            <span className="text-slate-400 text-[10px]">builds muscle</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center">
            <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Carbs</span>
            <span className="text-2xl font-black text-amber-600">{data.carbs}g</span>
            <span className="text-slate-400 text-[10px]">provides energy</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center">
            <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Fats</span>
            <span className="text-2xl font-black text-rose-600">{data.fats}g</span>
            <span className="text-slate-400 text-[10px]">essential nutrients</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClear}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="flex-[2] py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
          >
            Log Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;
