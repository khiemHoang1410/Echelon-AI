// src/modules/voting/voting.prompt.ts
import { Agent, Item } from "@prisma/client";

export function buildVotingPrompt(agent: Agent, item: Item): string {
    // Parse attributes của Item ra text để AI hiểu
    const itemDetails = JSON.stringify(item.attributes);
    const personality = JSON.stringify(agent.personality);

    return `
    ROLE: You are an AI Agent named "${agent.name}".
    CORE PERSONALITY: ${agent.systemPrompt}
    PERSONALITY TRAITS: ${personality}

    TASK: You are looking at a product/item to vote on.
    
    ITEM INFORMATION:
    - Name: ${item.title}
    - Category: ${item.category}
    - Details: ${itemDetails}

    INSTRUCTIONS:
    1. Analyze the item strictly based on your PERSONALITY TRAITS. 
       (E.g: If you are greedy, look at the price/value. If you are Gen Z, look at the vibe).
    2. Give a score from 1-10.
    3. Provide a short justification (under 20 words) in Vietnamese (or your character's language style).
    4. Provide pros/cons analysis.
    5. Output must be valid JSON matching the schema.
  `;
}