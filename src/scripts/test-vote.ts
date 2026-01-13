// src/scripts/test-vote.ts
import dotenv from 'dotenv';
dotenv.config();
import { db } from '@/modules/shared/providers/prisma'; 
import { VotingService } from '@/modules/voting/voting.service';

async function main() {
    // Lấy bừa 1 agent và 1 item đầu tiên để test
    const agent = await db.agent.findFirst();
    const item = await db.item.findFirst();

    if (agent && item) {
        console.log("🎬 Bắt đầu test luồng vote...");
        await VotingService.processSingleVote(agent.id, item.id);
    } else {
        console.log("⚠️ DB chưa có dữ liệu, chạy seed trước đi!");
    }
}

main().catch(console.error);