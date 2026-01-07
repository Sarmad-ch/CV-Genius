
import { GoogleGenAI } from "@google/genai";

// Always initialize GoogleGenAI with the API_KEY from environment variables as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeContent = async (content: string, context: string): Promise<string> => {
  try {
    // Generate content using gemini-3-flash-preview for text optimization tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As an expert resume writer, rewrite the following ${context} content to be more professional, impact-oriented, and include strong action verbs. Keep the length similar. Content: "${content}"`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });
    // The .text property directly returns the extracted string output
    return response.text?.trim() || content;
  } catch (error) {
    console.error("Gemini optimization failed:", error);
    return content;
  }
};

export const generateSummary = async (experiences: string): Promise<string> => {
  try {
    // Generate content using gemini-3-flash-preview for professional summary generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following work experiences, write a compelling, 3-sentence professional summary for a resume: "${experiences}"`,
      config: {
        temperature: 0.8,
      },
    });
    // The .text property directly returns the extracted string output
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini summary generation failed:", error);
    return "";
  }
};
