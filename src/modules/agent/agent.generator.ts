import { db } from "@/modules/shared/providers/prisma";
import { askAI } from "@/lib/groq"; // Import Groq thay vì Gemini

export const AgentGenerator = {
    async spawnRandomAgent() {
        console.log("🧬 [GROQ] Đang tổng hợp DNA cho Agent mới...");

        // 1. Prompt
        const systemPrompt = `
      You are a creative writer designed to generate unique personas for an AI voting simulation.
      Output strictly in JSON format.
    `;

        const userPrompt = `
      Create a unique, eccentric fictional persona for a voting AI agent.
      Required JSON Structure:
      {
        "name": "Creative Name",
        "bio": "Short biography (under 20 words)",
        "systemPrompt": "The instruction prompt for this agent to act",
        "personality": {
          "traits": { "aggression": 1-10, "humor": 1-10, "chaos": 1-10 },
          "bias": ["array", "of", "topics", "they", "love/hate"]
        }
      }
      Make it diverse (e.g., Cyberpunk Hacker, Tired Cat, Medieval Knight, Angry Karen).
    `;

        try {
            // 2. Gọi Groq
            const agentData = await askAI(systemPrompt, userPrompt);

            if (!agentData || !agentData.name) {
                throw new Error("Groq trả về dữ liệu rỗng");
            }

            // 3. Xử lý dữ liệu (Tạo Slug, Avatar)
            const finalName = agentData.name;

            const slug = finalName
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '') || `agent-${Date.now()}`;

            const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}`;

            // 4. Lưu vào DB
            const newAgent = await db.agent.create({
                data: {
                    name: finalName,
                    slug: slug,
                    avatar: avatar,
                    bio: agentData.bio || "Một AI bí ẩn.",
                    systemPrompt: agentData.systemPrompt || "Bạn là một AI bí ẩn.",
                    personality: agentData.personality || {},
                    state: { energy: 100 }
                }
            });

            return newAgent;

        } catch (error) {
            console.error("💀 Lỗi khi sinh Agent (Groq):", error);
            // Trả về null để Simulation không bị crash
            return null;
        }
    }
};