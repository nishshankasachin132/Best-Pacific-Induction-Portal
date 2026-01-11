
import { GoogleGenAI } from "@google/genai";
import { InductionSection } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async answerQuestion(question: string, context: InductionSection[]) {
    const contextString = context.map(s => `${s.title}: ${s.content}`).join('\n\n');
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          You are the AI Assistant for Best Pacific Textiles Lanka Private Limited. 
          Use the following company induction information to answer the employee's question.
          If the answer isn't in the context, politely say you don't have that specific information and suggest they contact HR.
          
          Company Info:
          ${contextString}
          
          Question: ${question}
        `,
      });

      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "There was an error connecting to the AI assistant. Please try again later.";
    }
  }

  async generateSectionSummary(section: InductionSection) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize this company induction section in 2 bullet points: \n\n ${section.content}`,
      });
      return response.text || "Summary unavailable.";
    } catch (error) {
      return "Summary generation failed.";
    }
  }
}

export const gemini = new GeminiService();
