import { RankedItem } from "./billboard.types";

// Hàm tính điểm trung bình
export function calculateAverageScore(votes: { score: number }[]): number {
    if (votes.length === 0) return 0;
    const total = votes.reduce((sum, v) => sum + v.score, 0);
    return parseFloat((total / votes.length).toFixed(1));
}

// Hàm sắp xếp bảng xếp hạng (Logic core)
export function sortItemsByRank(items: any[]): RankedItem[] {
    return items
        .map((item) => ({
            ...item,
            avgScore: calculateAverageScore(item.votes),
            voteCount: item.votes.length // Hoặc dùng item._count.votes nếu query từ DB
        }))
        .sort((a, b) => {
            // Ưu tiên điểm số -> Nếu bằng điểm thì ưu tiên số lượng vote
            if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
            return b.voteCount - a.voteCount;
        });
}