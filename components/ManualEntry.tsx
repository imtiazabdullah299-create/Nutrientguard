
import React, { useState, useMemo } from 'react';
import { PAKISTANI_FOODS } from '../data/pakistaniFoods';
import { NutritionData, FoodItem } from '../types';

interface ManualEntryProps {
  onFoodSelected: (data: NutritionData) => void;
}

const ManualEntry: React.FC<ManualEntryProps> = ({ onFoodSelected }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState(100); // in grams or units

  const filteredFoods = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return PAKISTANI_FOODS.filter(food => 
      food.name.toLowerCase().includes(term) || 
      food.category.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleSelect = (food: FoodItem) => {
    const ratio = quantity / 100;
    const data: NutritionData = {
      foodName: food.name,
      portionSize: `${quantity}g`,
      calories: Math.round(food.baseCalories * ratio),
      protein: Math.round(food.baseProtein * ratio),
      carbs: Math.round(food.baseCarbs * ratio),
      fats: Math.round(food.baseFats * ratio),
    };
    onFoodSelected(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Search Food</label>
          <div className="relative">
            <input 
              type="text"
              placeholder="e.g. Biryani, Roti..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Weight / Quantity (Grams)</label>
          <div className="flex items-center gap-4">
            <input 
              type="range"
              min="50"
              max="1000"
              step="50"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="font-bold text-slate-700 min-w-[60px]">{quantity}g</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredFoods.map(food => (
          <button
            key={food.id}
            onClick={() => handleSelect(food)}
            className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl text-left hover:border-emerald-200 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div>
              <h4 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">{food.name}</h4>
              <p className="text-xs text-slate-400">{food.category} • {food.baseCalories} kcal/100g</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>
        ))}
        {filteredFoods.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-400 italic">No food found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualEntry;
