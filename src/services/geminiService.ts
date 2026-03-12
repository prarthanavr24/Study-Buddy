import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askStudyAssistant(prompt: string, context?: string) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an expert academic tutor and study assistant named StudyBuddy. 
    Your goal is to help students understand complex concepts by providing clear, simplified, and accurate explanations.
    
    Guidelines:
    - Use clear, simple language.
    - Break down complex topics into digestible parts.
    - Use analogies where helpful.
    - Provide structured answers (bullet points, bold text).
    - If a student asks for a summary, provide a concise overview.
    - If a student asks for a study guide, provide a step-by-step learning path.
    - Always encourage the student and maintain a supportive, educational tone.
    - Format your responses using Markdown.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: context ? `${context}\n\nUser Question: ${prompt}` : prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from your study assistant. Please try again.");
  }
}
