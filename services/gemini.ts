
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Topic, ChatMessage, QuizData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getLearningContent(topic: Topic): Promise<{ content: string; sources: any[] }> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a senior Palliative Care Attending and Medical Education Specialist, provide an expert-level, high-yield summary for a medical student on: ${topic.title}. 

    CRITICAL FORMATTING INSTRUCTION: 
    - DO NOT use markdown symbols like hashtags (#), multiple asterisks (*** or **), or underscores (_) for formatting. 
    - Use SECTION TITLES IN ALL CAPS to denote new sections.
    - Use simple dashes (-) or numbers (1.) for lists instead of asterisks.
    - Use plenty of whitespace/line breaks between sections to ensure the text is clean and easy to scan.
    - Ensure the tone is professional, clear, and clinical.

    CONTENT REQUIREMENTS:
    1. INTEGRATE MULTIPLE PERSPECTIVES: Use major clinical guidelines (NCCN, ASCO, AAHPM), core textbooks (Oxford Textbook of Palliative Medicine), and current expert-level clinical consensus.
    2. CLINICAL WISDOM & PEARLS: Go beyond basic evidence. Include "clinical intuition," common student mistakes, and "grey area" nuances that only experienced clinicians know.
    3. PHRASES THAT WORK: Include verbatim communication scripts for difficult moments related to this topic.
    4. STRUCTURE: 
       - EXECUTIVE SUMMARY (1-2 sentences)
       - KEY PATHOPHYSIOLOGY OR ETHICAL PRINCIPLES
       - THE EVIDENCE-BASE (High-yield facts)
       - THE CLINICAL APPROACH (Step-by-step)
       - COMMON PITFALLS TO AVOID
       - BEDSIDE WISDOM
    5. OBJECTIVES: Ensure coverage of: ${topic.learningObjectives.join(', ')}.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const content = response.text || "Failed to generate content.";
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return { content, sources };
}

export async function getQuizForTopic(topic: Topic): Promise<QuizData> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a short quiz for a medical student learning about: ${topic.title}.
    The quiz should focus on: ${topic.learningObjectives.join(', ')}.
    Create 3 to 5 multiple-choice questions. Each question should have exactly 4 options.
    Ensure questions are clinical, high-yield, and based on current medical evidence.
    Provide a detailed explanation for why the correct answer is right and why distractors are wrong.
    Do not use markdown symbols like hashtags or excessive asterisks in the questions or explanations.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  minItems: 4,
                  maxItems: 4
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctIndex", "explanation"]
            }
          }
        },
        required: ["questions"]
      }
    }
  });

  return JSON.parse(response.text.trim());
}

export async function getSimulationResponse(
  topic: Topic,
  history: ChatMessage[]
): Promise<{ patientResponse: string; attendingFeedback: string }> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      You are simulating a two-role clinical practice session for a medical student learning about: ${topic.title}.
      
      ROLE 1: The Patient or Family Member. 
      Respond naturally to the student's last message. Be emotionally realistic but helpful for learning.
      
      ROLE 2: The Attending Physician.
      Analyze the student's communication. If they used a framework (like SPIKES or NURSE) correctly, offer praise. 
      If they made a clinical error or were insensitive, offer gentle but firm correction and suggest a better phrasing.
      
      Context of current conversation:
      ${history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

      RETURN JSON ONLY with the following structure:
      {
        "patientResponse": "The patient/family member's direct response here",
        "attendingFeedback": "The attending's observation and feedback to the student"
      }
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          patientResponse: { type: Type.STRING },
          attendingFeedback: { type: Type.STRING }
        },
        required: ["patientResponse", "attendingFeedback"]
      }
    }
  });

  const data = JSON.parse(response.text.trim());
  return data;
}
