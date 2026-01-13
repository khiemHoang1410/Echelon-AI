import { Item, Vote } from "@prisma/client";

// Mở rộng type Item gốc để thêm các trường đã tính toán
export type RankedItem = Item & {
    votes: Vote[];
    voteCount: number;
    avgScore: number;
};