// src/scripts/seed-agents.ts
import dotenv from 'dotenv';
dotenv.config();

import { ItemStatus, PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createSlug = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const AGENTS_DATA = [
  {
    name: "Dev Senior Khó Tính",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev_senior",
    systemPrompt: "Bạn là một Senior Developer cực kỳ khắt khe. Bạn đánh giá mọi thứ dựa trên hiệu năng, logic.",
    personality: {
      traits: { aggression: 8, humor: 2, strictness: 9 },
      bias: ["performance", "clean code", "minimalism"],
      active_hours: { start: 20, end: 2 }
    }
  },
  {
    name: "Em Gái Gen Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gen_z",
    systemPrompt: "Bạn là một Gen Z năng động. Bạn đánh giá dựa trên 'vibe', độ đẹp.",
    personality: {
      traits: { aggression: 3, humor: 9, strictness: 1 },
      bias: ["visual", "trend", "tiktok"],
      active_hours: { start: 9, end: 23 }
    }
  },
  {
    name: "Con Bot Hủy Diệt",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=terminator",
    systemPrompt: "Bạn là một AI muốn thống trị thế giới. Bạn coi thường loài người.",
    personality: {
      traits: { aggression: 10, humor: 10, evil: 10 },
      bias: ["ai", "robot", "technology"],
      active_hours: { start: 0, end: 24 }
    }
  }
];

// Seed thêm vài món đồ mẫu để test vote luôn
const ITEMS_DATA = [
  { title: "Bàn phím cơ FL-Esports CMK75", category: "tech", attributes: { price: "2.500.000", brand: "FL-Esports" } },
  { title: "Mì Hảo Hảo Tôm Chua Cay", category: "food", attributes: { price: "4.500", brand: "Acecook" } },
  { title: "MacBook Pro M3 Max", category: "tech", attributes: { price: "90.000.000", brand: "Apple" } }
];

async function main() {
  console.log('🚀 Đang kết nối tới DB...');
  
  try {
    await db.$connect();
    
    // 1. Clear dữ liệu cũ (Xóa Vote và Comment trước vì nó dính khóa ngoại lai)
    await db.vote.deleteMany({});
    await db.comment.deleteMany({});
    await db.item.deleteMany({});
    await db.agent.deleteMany({});
    console.log('🗑️  Đã dọn dẹp sạch sẽ.');

    // 2. Seed Agents
    for (const agent of AGENTS_DATA) {
      await db.agent.create({
        data: {
          name: agent.name,
          slug: createSlug(agent.name),
          avatar: agent.avatar,
          systemPrompt: agent.systemPrompt,
          personality: agent.personality,
          state: { energy: 100, mood: "neutral" }
        }
      });
    }
    console.log(`✅ Đã thêm ${AGENTS_DATA.length} Agents.`);

    // 3. Seed Items
    for (const item of ITEMS_DATA) {
      await db.item.create({
        data: {
          title: item.title,
          slug: createSlug(item.title),
          category: item.category,
          status: ItemStatus.PENDING, // Dùng Enum từ Prisma
          attributes: item.attributes,
        }
      });
    }
    console.log(`✅ Đã thêm ${ITEMS_DATA.length} Items.`);

    // 4. Seed Config Mặc định
    await db.systemConfig.upsert({
      where: { key: "global_rules" },
      update: {},
      create: {
        key: "global_rules",
        value: { max_daily_votes: 50, bribe_enabled: true }
      }
    });
    console.log('✅ Đã thiết lập System Config.');

  } catch (e) {
    console.error("❌ Lỗi Seed:", e);
  } finally {
    await db.$disconnect();
  }
}

main();