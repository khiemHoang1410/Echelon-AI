import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
    const items = [
        { title: "MacBook Pro M3 Max", category: "TECH", attributes: { price: "3000$", ram: "32GB", screen: "14 inch" } },
        { title: "Mì Hảo Hảo Tôm Chua Cay", category: "FOOD", attributes: { price: "5k", spicy: "Yes", legendary: "True" } },
        { title: "Honda AirBlade 160", category: "VEHICLE", attributes: { engine: "160cc", smartkey: "Yes" } },
        { title: "Sách 'Code Dạo Ký Sự'", category: "BOOK", attributes: { author: "Phạm Huy Hoàng", pages: 300 } },
        { title: "Ghế Công Thái Học Ergonomic", category: "FURNITURE", attributes: { material: "Mesh", weight: "20kg" } },
    ];

    for (const item of items) {
        await db.item.create({
            data: {
                ...item,
                status: "PENDING",
                slug: item.title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
                description: `Review for ${item.title}`
            }
        });
        console.log(`✅ Created: ${item.title}`);
    }
}

main();