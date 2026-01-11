// src/modules/agent/agent.types.ts
import { Agent as PrismaAgent } from '@prisma/client';

export interface AgentPersonalityConfig {
  aggression_level: number; // 1-10: Độ "húng chó"
  humor_level: number;      // 1-10: Độ hài hước
  bias_topics: string[];    // Những chủ đề nó thiên vị (hoặc ghét)
  active_hours: {           // Giả lập khung giờ hoạt động
    start: number; 
    end: number 
  };
}

export type Agent = PrismaAgent & {
  personalityConfig: AgentPersonalityConfig; // Override lại kiểu Json của Prisma
};