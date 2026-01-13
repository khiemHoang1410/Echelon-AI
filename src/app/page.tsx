import { db } from "@/modules/shared/providers/prisma";
import Link from "next/link";
import "./globals.css"

export default async function HomePage() {
  const items = await db.item.findMany({
    include: { _count: { select: { votes: true } } },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        🗳️ ECHELON AI COUNCIL
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link href={`/items/${item.id}`} key={item.id}>
            <div className="group border border-slate-800 bg-slate-900 p-6 rounded-xl hover:border-purple-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-purple-500/20">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-400 uppercase">
                  {item.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === "COMPLETED"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h2 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                {item.title}
              </h2>
              <div className="text-sm text-slate-400">
                Đã có{" "}
                <span className="text-white font-bold">
                  {item._count.votes}
                </span>{" "}
                thành viên bỏ phiếu
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
