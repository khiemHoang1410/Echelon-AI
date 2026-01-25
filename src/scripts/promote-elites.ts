import { db } from "@/modules/shared/providers/prisma";

async function main() {
    console.log("👑 Đang tiến hành bổ nhiệm cán bộ...");

    const totalAgents = await db.agent.count();
    if (totalAgents === 0) {
        console.error("❌ LỖI: Database trống trơn! Ngài đã chạy lệnh import chưa?");
        return;
    }
    console.log(`📊 Tổng dân số: ${totalAgents}`);

    // 1. Reset tất cả về NPC trước (để tránh lỗi)
    // await db.agent.updateMany({ data: { tier: 'NPC' } });

    // 2. Lấy ngẫu nhiên 50 ID để thăng chức ELITE
    const allAgents = await db.agent.findMany({ select: { id: true } });

    // Trộn danh sách (Shuffle)
    const shuffled = allAgents.sort(() => 0.5 - Math.random());

    const eliteCandidates = shuffled.slice(0, 50); // 50 ông đầu tiên
    const mobCandidates = shuffled.slice(50, 550); // 500 ông tiếp theo

    // 3. Update ELITE
    for (const agent of eliteCandidates) {
        await db.agent.update({
            where: { id: agent.id },
            data: {
                tier: 'ELITE',
                fame: Math.floor(Math.random() * 50000) + 1000 // Buff Fame
            }
        });
    }
    console.log(`✅ Đã thăng chức cho 50 KOLs (Elite).`);

    // 4. Update MOB
    for (const agent of mobCandidates) {
        await db.agent.update({
            where: { id: agent.id },
            data: {
                tier: 'MOB',
                fame: Math.floor(Math.random() * 1000) + 100
            }
        });
    }
    console.log(`✅ Đã thăng chức cho 500 Giang cư mận (Mob).`);

    console.log("🎉 Xong! Xã hội giờ đã có giai cấp.");
}

main()
    .catch(console.error)
    .finally(() => db.$disconnect());