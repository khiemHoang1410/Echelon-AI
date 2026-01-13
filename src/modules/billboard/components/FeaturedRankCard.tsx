import Link from "next/link";
import { RankedItem } from "../billboard.types";

export function FeaturedRankCard({ item }: { item: RankedItem }) {
  return (
    <section className="mb-16">
      <div className="text-xs font-bold text-yellow-500 tracking-widest mb-2 flex items-center gap-2">
        <span>👑 CURRENT NO.1</span>
        <span className="h-px flex-1 bg-gradient-to-r from-yellow-500/50 to-transparent"></span>
      </div>

      <Link href={`/items/${item.id}`}>
        <div className="group relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-2xl hover:border-yellow-500/50 transition-all duration-300 shadow-2xl shadow-black/50 overflow-hidden cursor-pointer">
          {/* Big Number Background */}
          <div className="absolute -right-6 -bottom-10 text-[200px] font-black text-slate-800/20 italic select-none group-hover:text-yellow-500/10 transition-colors">
            1
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Score Badge */}
            <div className="flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-yellow-500 text-black rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)] shrink-0">
              <span className="text-3xl md:text-5xl font-black tracking-tighter">
                {item.avgScore}
              </span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide">
                Points
              </span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <span className="inline-block px-3 py-1 mb-3 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400 uppercase font-mono tracking-wider">
                {item.category}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-2 group-hover:text-yellow-400 transition-colors">
                {item.title}
              </h2>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>{item.voteCount} Reviews from Agents</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
