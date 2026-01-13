// src/lib/groq.ts
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Hàm gọi AI chung, trả về JSON
export async function askAI(systemPrompt: string, userPrompt: string) {
    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt + "\n\nIMPORTANT: Output strictly in JSON format." },
            { role: "user", content: userPrompt }
        ],
        // Model Llama 3 70B (Khôn ngang GPT-4) hoặc 8B (Nhanh siêu tốc)
        model: "llama-3.1-8b-instant",

        // Ép kiểu JSON (Tính năng xịn của Groq)
        response_format: { type: "json_object" },
        temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    try {
        return JSON.parse(content);
    } catch (e) {
        console.error("Lỗi parse JSON từ Groq:", content);
        return null;
    }
}