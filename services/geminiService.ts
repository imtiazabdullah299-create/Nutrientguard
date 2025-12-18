
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const API_KEY = process.env.API_KEY;

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `Analyze this food image. Identify the dish, estimate the portion size, and provide nutritional values (calories, protein, carbs, fats). 
  Respond with a JSON object specifically. If the food is Pakistani, identify its specific local name.
  
  Expected JSON structure:
  {
    "foodName": "string",
    "portionSize": "string (e.g. 1 plate, 250g)",
    "calories": number,
    "protein": number (grams),
    "carbs": number (grams),
    "fats": number (grams)
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            portionSize: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER }
          },
          required: ["foodName", "portionSize", "calories", "protein", "carbs", "fats"]
        }
      }
    });

    const resultText = response.text || "{}";
    return JSON.parse(resultText) as NutritionData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
};
