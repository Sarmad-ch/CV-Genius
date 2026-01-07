
import { GoogleGenAI } from "@google/genai";

// We initialize inside a getter to ensure errors don't crash the entire app 
// if process.env.API_KEY is temporarily unavailable or if the platform 
// handles injection differently.
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    if (!process.env.API_KEY) {
      console.warn("API_KEY is missing from environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  }
  return aiInstance;
};

export const optimizeContent = async (content: string, context: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As an expert resume writer, rewrite the following ${context} content to be more professional, impact-oriented, and include strong action verbs. Keep the length similar. Content: "${content}"`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });
    return response.text?.trim() || content;
  } catch (error) {
    console.error("Gemini optimization failed:", error);
    return content;
  }
};

export const generateSummary = async (experiences: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following work experiences, write a compelling, 3-sentence professional summary for a resume: "${experiences}"`,
      config: {
        temperature: 0.8,
      },
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini summary generation failed:", error);
    return "";
  }
};
