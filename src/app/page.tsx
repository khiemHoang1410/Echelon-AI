"use client"; // Chuyển sang Client Side Rendering để update real-time

import useSWR from "swr";
import { BillboardHeader } from "@/modules/billboard/components/BillboardHeader";
import { FeaturedRankCard } from "@/modules/billboard/components/FeaturedRankCard";
import { RankedListRow } from "@/modules/billboard/components/RankedListRow";
// ... imports UI

// Fetcher function cho SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BillboardPage() {
  // Tự động gọi API mỗi 3 giây (refreshInterval)
  const { data: rankedItems, error } = useSWR("/api/billboard", fetcher, {
    refreshInterval: 3000,
  });

  if (!rankedItems) return <div className="text-white">Loading Matrix...</div>;

  const top1 = rankedItems[0];
  const runnerUps = rankedItems.slice(1);

  return (
    <main className="min-h-screen bg-[#0B0C15] text-white">
      {/* ... Giữ nguyên phần UI Header ... */}
      <BillboardHeader />

      <div className="max-w-4xl mx-auto p-6">
        {top1 && <FeaturedRankCard item={top1} />}

        <div className="space-y-4">
          {runnerUps.map((item: any, index: number) => (
            <RankedListRow key={item.id} item={item} rank={index + 2} />
          ))}
        </div>
      </div>
    </main>
  );
}
