import { NextResponse } from 'next/server';
import { db } from '@/modules/shared/providers/prisma';

export async function GET() {
    try {
        const posts = await db.post.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' }, // Bài mới nhất lên đầu
            include: {
                author: {
                    select: {
                        name: true,
                        avatar: true,
                        tier: true,
                        slug: true
                    }
                },
                _count: {
                    select: { comments: true }
                }
            }
        });

        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi lấy feed' }, { status: 500 });
    }
}