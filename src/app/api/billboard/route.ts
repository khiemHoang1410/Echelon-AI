import { NextResponse } from "next/server";
import { db } from "@/modules/shared/providers/prisma";
import { sortItemsByRank } from "@/modules/billboard/billboard.utils";

export async function GET() {
    const rawItems = await db.item.findMany({ include: { votes: true } });
    const rankedItems = sortItemsByRank(rawItems);
    return NextResponse.json(rankedItems);
}