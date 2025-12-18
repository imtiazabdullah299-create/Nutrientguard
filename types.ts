
export enum AppMode {
  AI_DETECTION = 'AI_DETECTION',
  MANUAL_ENTRY = 'MANUAL_ENTRY'
}

export interface NutritionData {
  foodName: string;
  portionSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FoodItem {
  id: string;
  name: string;
  baseCalories: number; // per 100g or per unit
  baseProtein: number;
  baseCarbs: number;
  baseFats: number;
  category: string;
}

export interface LogEntry extends NutritionData {
  timestamp: number;
}
