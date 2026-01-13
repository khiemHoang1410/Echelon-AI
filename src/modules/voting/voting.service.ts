// src/modules/voting/voting.service.ts
import { db } from "@/modules/shared/providers/prisma";
import { model } from "@/lib/gemini";
import { buildVotingPrompt } from "./voting.prompt";

// --- BỘ NÃO DỰ PHÒNG (FAKE AI) ---
// Khi Google chặn cửa, ta dùng cái này
function generateFakeVote(agent: any, item: any) {
    // 1. Tính điểm dựa trên tính cách (Logic game RPG)
    let baseScore = Math.floor(Math.random() * 10) + 1; // Random 1-10

    // Nếu Agent khó tính -> Trừ điểm
    if (agent.personality?.traits?.strictness > 5) baseScore -= 2;
    // Nếu Agent dễ tính -> Cộng điểm
    if (agent.personality?.traits?.humor > 5) baseScore += 1;

    // Clamp điểm trong khoảng 1-10
    const finalScore = Math.max(1, Math.min(10, baseScore));

    // 2. Random câu chém gió
    const fakeComments = [
        "Cũng được đấy, nhưng chưa đủ đô.",
        "Thứ này thật thú vị, tôi sẽ cân nhắc.",
        "Không ấn tượng lắm, next!",
        "Tuyệt vời ông mặt trời!",
        "Quá đắt, không đáng tiền.",
        "Nhìn giao diện là thấy uy tín rồi.",
        "Ảo ma canada, mua vội!",
        "Cần thêm thời gian để kiểm chứng."
    ];
    const randomJustification = fakeComments[Math.floor(Math.random() * fakeComments.length)];

    return {
        score: finalScore,
        justification: `(Offline Mode) ${randomJustification}`,
        analysis: {
            pros: ["Chạy nhanh", "Không tốn tiền"],
            cons: ["Hơi ngáo", "Không dùng AI thật"],
            emotional_state: "Saving Money"
        }
    };
}

// --- LOGIC CHÍNH ---
export const VotingService = {
    async processSingleVote(agentId: string, itemId: string) {
        const agent = await db.agent.findUnique({ where: { id: agentId } });
        const item = await db.item.findUnique({ where: { id: itemId } });

        if (!agent || !item) return null;

        // Check trùng (Skip nếu đã vote)
        const exists = await db.vote.findUnique({
            where: { itemId_agentId: { itemId, agentId } }
        });
        if (exists) return null;

        console.log(`🤖 ${agent.name} đang suy nghĩ...`);

        let voteData;

        try {
            // CÁCH 1: Dùng AI Thật (Gemini)
            const prompt = buildVotingPrompt(agent, item);
            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json|```/g, "").trim();
            voteData = JSON.parse(text);
            console.log(`✨ AI Thật đã trả lời!`);

        } catch (error: any) {
            // CÁCH 2: Nếu AI Thật bị lỗi (Hết quota, 429, Mạng lag...) -> Dùng Fake AI
            console.warn(`⚠️ Gemini hết quota hoặc lỗi. Chuyển sang chế độ tiết kiệm!`);
            voteData = generateFakeVote(agent, item);
        }

        // Lưu vào DB (Dù là Fake hay Real thì cũng lưu hết)
        try {
            await db.vote.create({
                data: {
                    itemId: item.id,
                    agentId: agent.id,
                    score: voteData.score,
                    justification: voteData.justification,
                    analysis: voteData.analysis,
                    simulatedAt: new Date(),
                    // Đánh dấu vote này là hàng Fake hay Real để sau này biết đường lọc
                    // (Tạm thời tôi dùng trường isBribed để đánh dấu Fake cho nhanh, đỡ sửa Schema)
                    isBribed: voteData.analysis.emotional_state === "Saving Money"
                },
            });

            await db.item.update({
                where: { id: item.id },
                data: { voteCount: { increment: 1 } }
            });

            console.log(`✅ ${agent.name}: ${voteData.score}/10 - ${voteData.justification}`);
            return voteData;

        } catch (dbError) {
            console.error("❌ Lỗi lưu DB:", dbError);
            return null;
        }
    },
};