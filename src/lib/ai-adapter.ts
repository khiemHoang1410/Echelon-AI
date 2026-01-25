import { Ollama } from 'ollama';
import Groq from 'groq-sdk';

// CẤU HÌNH
const IP = process.env.ONEPLUS_IP; // ⚠️ Thay IP điện thoại ngài vào đây (xem trong Wifi settings)
const USE_GROQ_FALLBACK = true; // Cho phép dùng Groq nếu điện thoại sập

// 1. Setup Ollama (Local Phone)
const ollama = new Ollama({ host: `http://${IP}:11434` });

// 2. Setup Groq (Cloud Backup)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export type AgentTier = 'ELITE' | 'MOB' | 'NPC';

export const AIAdapter = {
    async generateText(systemPrompt: string, userPrompt: string, tier: AgentTier = 'MOB') {
        // Ưu tiên dùng Local (Điện thoại)
        try {
            // Chọn model dựa trên giai cấp (Elite dùng hàng xịn 3B, Mob dùng hàng lở 1B)
            const model = tier === 'ELITE' ? 'deepseek-r1:8b' : 'llama3.2';

            console.log(`🤖 Đang dùng điện thoại (${model})...`);


            const response = await ollama.chat({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                stream: false,
                options: {
                    temperature: 0.8,
                    num_thread: 6
                } // 0.8 để văn phong bay bổng, sáng tạo
            });

            return response.message.content;

        } catch (localError) {
            console.warn(`⚠️ Local AI (${ONEPLUS_IP}) không phản hồi. Đang thử Groq...`);

            if (USE_GROQ_FALLBACK && process.env.GROQ_API_KEY) {
                try {
                    const completion = await groq.chat.completions.create({
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ],
                        model: "llama-3.3-70b-versatile",
                        temperature: 0.8,
                    });
                    return completion.choices[0]?.message?.content || "";
                } catch (groqError) {
                    console.error("❌ Cả Local và Groq đều tạch!");
                    return null;
                }
            }
            return null;
        }
    }
};