import { NextResponse } from "next/server";
import { db } from "@/modules/shared/providers/prisma";
import { AgentGenerator } from "@/modules/agent/agent.generator";
import { VotingService } from "@/modules/voting/voting.service";

// Hàm random helper
const randomChance = (percent: number) => Math.random() * 100 < percent;

export async function GET() {
    // --- GIAI ĐOẠN 1: SINH SẢN (SPAWN) ---
    // 30% cơ hội sinh ra một agent mới mỗi lần chạy
    if (Math.random() * 100 < 30) {
        try {
            const newAgent = await AgentGenerator.spawnRandomAgent();
            if (newAgent) { // Check null
                console.log(`👶 NEW BORN: ${newAgent.name} vừa gia nhập hội đồng!`);
            }
        } catch (e) {
            console.log("⚠️ Bỏ qua lượt sinh Agent do lỗi hệ thống.");
        }
    }

    // --- GIAI ĐOẠN 2: HOẠT ĐỘNG (ACTION) ---
    // Lấy ngẫu nhiên 1 Item đang PENDING hoặc PROCESSING
    const candidates = await db.item.findMany({
        where: {
            status: { in: ['PENDING', 'PROCESSING'] }
        },
        take: 10, // Lấy top 10 món
        orderBy: { updatedAt: 'desc' }
    });

    if (candidates.length > 0) {
        // 2. Bốc thăm ngẫu nhiên 1 món trong danh sách này (True Random)
        const activeItem = candidates[Math.floor(Math.random() * candidates.length)];

        // 3. Chọn Agent ngẫu nhiên (Giữ nguyên)
        const agents = await db.agent.findMany();
        if (agents.length === 0) return NextResponse.json({ status: "No agents" });

        const randomAgent = agents[Math.floor(Math.random() * agents.length)];

        // 4. Gọi Vote (Dùng VotingService đã update Groq)
        try {
            const result = await VotingService.processSingleVote(randomAgent.id, activeItem.id);

            if (result) {
                return NextResponse.json({ status: "Voted", agent: randomAgent.name, item: activeItem.title });
            } else {
                return NextResponse.json({ status: "Skipped (Already voted or Error)" });
            }
        } catch (e) {
            return NextResponse.json({ status: "Error", error: String(e) });
        }
    }

    return NextResponse.json({ status: "Idle - No items to vote" });
}