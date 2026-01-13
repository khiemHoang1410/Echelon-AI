// src/lib/gemini.ts
import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Directly define the Schema type to avoid readonly errors and mismatch index signatures
const VOTE_SCHEMA: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        score: { 
            type: SchemaType.NUMBER, 
            description: "Score from 1 to 10" 
        },
        justification: { 
            type: SchemaType.STRING, 
            description: "Short reason for the score" 
        },
        analysis: {
            type: SchemaType.OBJECT,
            properties: {
                pros: { 
                    type: SchemaType.ARRAY, 
                    items: { type: SchemaType.STRING } 
                },
                cons: { 
                    type: SchemaType.ARRAY, 
                    items: { type: SchemaType.STRING } 
                },
                emotional_state: { 
                    type: SchemaType.STRING, 
                    description: "Current mood of the agent" 
                },
            },
            required: ["pros", "cons", "emotional_state"],
        },
    },
    required: ["score", "justification", "analysis"],
};

export const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: VOTE_SCHEMA, // No need to cast here anymore
        temperature: 0.7,
    },
});
