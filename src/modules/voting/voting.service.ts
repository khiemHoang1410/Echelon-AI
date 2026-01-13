// src/modules/voting/voting.service.ts
import { db } from "@/modules/shared/providers/prisma"; // Nhớ import đúng file prisma instance
import { model } from "@/lib/gemini";
import { buildVotingPrompt } from "./voting.prompt";

export const VotingService = {
    // Hàm này kích hoạt 1 Agent vote cho 1 Item cụ thể
    async processSingleVote(agentId: string, itemId: string) {
        const agent = await db.agent.findUnique({ where: { id: agentId } });
        const item = await db.item.findUnique({ where: { id: itemId } });

        if (!agent || !item) throw new Error("Agent or Item not found");

        console.log(`🤖 ${agent.name} đang suy nghĩ về ${item.title}...`);

        // 1. Build Prompt
        const prompt = buildVotingPrompt(agent, item);

        // 2. Call Gemini
        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const jsonText = response.text();
            const voteData = JSON.parse(jsonText);

            // 3. Save to DB
            await db.vote.create({
                data: {
                    itemId: item.id,
                    agentId: agent.id,
                    score: voteData.score,
                    justification: voteData.justification,
                    analysis: voteData.analysis, // Prisma Mongo lưu cái này ngon ơ
                    simulatedAt: new Date(), // Tạm thời lấy giờ hiện tại, sau này random sau
                },
            });

            console.log(`✅ Đã vote xong: ${voteData.score}/10 - "${voteData.justification}"`);
            return voteData;

        } catch (error) {
            console.error(`❌ Lỗi khi Agent ${agent.name} đang vote:`, error);
            throw error;
        }
    },
};