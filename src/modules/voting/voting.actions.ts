'use server'

import { db } from "@/modules/shared/providers/prisma";
import { VotingService } from "./voting.service";
import { revalidatePath } from "next/cache";

export async function triggerCouncilVoteAction(itemId: string) {
    // 1. Lấy tất cả agent
    const agents = await db.agent.findMany();

    if (agents.length === 0) return { error: "Chưa có Agent nào!" };

    // 2. Chạy vòng lặp (Trong thực tế nên dùng Queue, nhưng MVP ta chạy Promise.all cho máu)
    // Lưu ý: Gemini có rate limit, nếu nhiều agent quá (20+) thì phải delay
    const results = await Promise.allSettled(
        agents.map(async (agent) => {
            // Check xem đã vote chưa để đỡ tốn tiền API
            const existingVote = await db.vote.findUnique({
                where: { itemId_agentId: { itemId, agentId: agent.id } }
            });

            if (existingVote) return { status: 'skipped', agent: agent.name };

            return await VotingService.processSingleVote(agent.id, itemId);
        })
    );

    // 3. Update trạng thái Item
    await db.item.update({
        where: { id: itemId },
        data: { status: 'COMPLETED' } // Tạm thời set luôn là xong
    });

    // 4. Refresh lại trang để hiện kết quả mới
    revalidatePath(`/items/${itemId}`);

    return { success: true, count: results.length };
}