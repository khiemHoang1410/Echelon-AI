import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const db = new PrismaClient();

async function main() {
    const fileName = '10000_full_agents.json';
    const filePath = path.join(process.cwd(), fileName);

    // 1. Kiểm tra file
    if (!fs.existsSync(filePath)) {
        console.error(`❌ LỖI: Không tìm thấy file '${fileName}' ở thư mục gốc!`);
        console.log("👉 Hãy kéo file JSON tải từ Colab về và để ngang hàng với package.json");
        process.exit(1);
    }

    console.log("📦 Đang đọc dữ liệu từ file...");
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const agents = JSON.parse(rawData);

    console.log(`🔥 Tìm thấy ${agents.length} hồ sơ. Bắt đầu nhập khẩu...`);

    // 2. Xóa sạch dân số cũ (Optional - Để tránh trùng lặp nếu chạy lại)
    // console.log("🧹 Đang dọn dẹp dân số cũ...");
    // await db.agent.deleteMany({}); 

    // 3. Chia nhỏ để nhét vào DB (Batching)
    // MongoDB đôi khi không chịu nổi 10k records 1 lúc, nên ta chia ra từng cục 1000
    const BATCH_SIZE = 1000;

    for (let i = 0; i < agents.length; i += BATCH_SIZE) {
        const batch = agents.slice(i, i + BATCH_SIZE);

        await db.agent.createMany({
            data: batch
        });

        const progress = Math.min(i + BATCH_SIZE, agents.length);
        const percent = ((progress / agents.length) * 100).toFixed(1);
        console.log(`✅ Đã nhập: ${progress}/${agents.length} cư dân (${percent}%)`);
    }

    console.log("🎉 HOÀN TẤT! Echelon giờ đã là một đại đô thị.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });