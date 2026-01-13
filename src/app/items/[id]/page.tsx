// src/app/items/[id]/page.tsx

import { db } from "@/modules/shared/providers/prisma";
import { triggerCouncilVoteAction } from "@/modules/voting/voting.actions";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache"; // Import thêm cái này để refresh trang
import { SubmitButton } from "./submit-button";

// 👇 Sửa đường dẫn này trỏ đúng vào file ông tạo nút bấm (thường là ở components)
// Nếu ông để file nút bấm ngay cạnh file page này thì giữ nguyên "./submit-button"

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await db.item.findUnique({
    where: { id: id },
    include: {
      votes: { include: { agent: true } },
    },
  });

  if (!item) return notFound();

  // Tính điểm trung bình
  const avgScore =
    item.votes.length > 0
      ? (
          item.votes.reduce((sum, v) => sum + v.score, 0) / item.votes.length
        ).toFixed(1)
      : "N/A";

  // 👇 HÀM WRAPPER ĐỂ FIX LỖI TYPE (QUAN TRỌNG)
  async function handleVote() {
    "use server";
    // Gọi action gốc
    await triggerCouncilVoteAction(id); // Refresh lại trang hiện tại để thấy comment mới ngay lập tức
    revalidatePath(`/items/${id}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
          <p className="text-slate-400 font-mono text-sm">
            {JSON.stringify(item.attributes)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-black text-purple-400">{avgScore}</div>
          <div className="text-sm text-slate-500">Average Score</div>
        </div>
      </div>

      {/* Action Area */}
      <div className="mb-10 flex gap-4">
        {/* 👇 SỬA Ở ĐÂY: Gọi handleVote thay vì triggerCouncilVoteAction */}
        <form action={handleVote}>
          <SubmitButton />
        </form>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-6">
        {item.votes.map((vote) => (
          <div
            key={vote.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex gap-6 hover:bg-slate-800/50 transition"
          >
            {/* Avatar Agent */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <img
                src={
                  vote.agent.avatar ||
                  `https://ui-avatars.com/api/?name=${vote.agent.name}`
                }
                alt={vote.agent.name}
                className="w-16 h-16 rounded-full border-2 border-slate-700 bg-slate-800"
              />
              <span className="text-xs font-bold text-center max-w-[80px] leading-tight">
                {vote.agent.name}
              </span>
            </div>

            {/* Nội dung Vote */}
            <div className="grow">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`text-xl font-bold ${
                    vote.score >= 8
                      ? "text-green-400"
                      : vote.score <= 4
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {vote.score}/10
                </span>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase tracking-wider">
                  {/* @ts-ignore: Prisma JSON hell */}
                  {vote.analysis?.emotional_state || "Neutral"}
                </span>
              </div>

              <p className="text-gray-300 italic mb-3">
                "{vote.justification}"
              </p>

              {/* Phân tích Pros/Cons */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-green-900/10 p-3 rounded border border-green-900/30">
                  <span className="text-green-500 font-bold block mb-1">
                    + PROS
                  </span>
                  <ul className="list-disc pl-4 text-slate-400">
                    {/* @ts-ignore */}
                    {vote.analysis?.pros?.map((p: string, i: number) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-900/10 p-3 rounded border border-red-900/30">
                  <span className="text-red-500 font-bold block mb-1">
                    - CONS
                  </span>
                  <ul className="list-disc pl-4 text-slate-400">
                    {/* @ts-ignore */}
                    {vote.analysis?.cons?.map((p: string, i: number) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}

        {item.votes.length === 0 && (
          <div className="text-center py-20 text-slate-600 border border-dashed border-slate-800 rounded-xl">
            Chưa có ai bỏ phiếu cả. Hãy bấm nút "TRIỆU HỒI" đi!
          </div>
        )}
      </div>
    </main>
  );
}
