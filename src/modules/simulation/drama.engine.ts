import { db } from "@/modules/shared/providers/prisma";
import { AIAdapter } from "@/lib/ai-adapter";

export const DramaEngine = {
    // Hàm này sẽ chọn 1 KOL và bắt nó post bài
    async triggerElitePost() {
        console.log("🎲 Đang tìm kiếm một Idol để tạo content...");

        // 1. Lấy ngẫu nhiên 1 Agent thuộc tầng lớp ELITE
        const eliteCount = await db.agent.count({ where: { tier: 'ELITE' } });
        if (eliteCount === 0) return console.log("⚠️ Server chưa có Elite nào!");

        const randomSkip = Math.floor(Math.random() * eliteCount);
        const author = await db.agent.findFirst({
            where: { tier: 'ELITE' },
            skip: randomSkip
        });

        if (!author) return;

        console.log(`🎤 Idol được chọn: ${author.name} (${author.bio})`);

        // 2. Random chủ đề Drama
        const topics = [
            "Showbiz Việt (Scandal)", "Tiền ảo / Lùa gà", "Gen Z vs Gen Y",
            "Chuyện tình cảm / Cắm sừng", "Review đồ ăn dở tệ", "Đạo lý cuộc sống",
            "Khoe giàu (Flexing)", "Than nghèo kể khổ"
        ];
        const topic = topics[Math.floor(Math.random() * topics.length)];

        // 3. Soạn Prompt (Quan trọng: Yêu cầu nói tiếng Việt lóng)
        const systemPrompt = `
        Bạn đang nhập vai: ${author.name}.
        Tiểu sử: ${author.bio}.
        Tính cách: ${JSON.stringify(author.personality)}.
        
        NHIỆM VỤ: Viết một status ngắn (dưới 50 từ) lên mạng xã hội Echelon.
        CHỦ ĐỀ: ${topic}.
        
        YÊU CẦU BẮT BUỘC:
        - Dùng Tiếng Việt 100%.
        - Dùng giọng điệu tự nhiên, "teencode", từ lóng (vãi, ngon, cay, hãm...).
        - ${author.name.includes("Khá Bảnh") ? "Phải có điệu múa quạt hoặc nói kiểu giang hồ." : ""}
        - ${author.name.includes("Thầy") ? "Nói giọng đạo lý, dạy đời." : ""}
        - KHÔNG được dùng hashtag #, không mở bài kết bài. Vào thẳng vấn đề.
    `;

        // 4. Gọi AI
        const content = await AIAdapter.generateText(systemPrompt, "Viết status ngay đi.", "ELITE");

        if (content) {
            // 5. Lưu vào DB
            const newPost = await db.post.create({
                data: {
                    content: content.replace(/"/g, '').trim(), // Bỏ dấu ngoặc kép thừa
                    topic: topic,
                    authorId: author.id,
                    likeCount: Math.floor(Math.random() * 1000) // Fake like khởi điểm cho xôm
                }
            });
            console.log(`✅ [POST] ${author.name}: "${newPost.content}"`);
            return newPost;
        } else {
            console.log("❌ AI không chịu đẻ content.");
        }
    }
};