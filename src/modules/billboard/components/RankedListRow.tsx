import Link from "next/link";
import { RankedItem } from "../billboard.types";

interface Props {
  item: RankedItem;
  rank: number;
}

export function RankedListRow({ item, rank }: Props) {
  const isTop3 = rank <= 3;

  // Style màu sắc số thứ tự
  const rankColor =
    rank === 2
      ? "text-slate-300"
      : rank === 3
      ? "text-amber-700"
      : "text-slate-700 group-hover:text-slate-500";

  return (
    <Link href={`/items/${item.id}`}>
      <div className="group flex items-center gap-4 md:gap-8 p-4 md:p-6 bg-slate-900/50 border border-white/5 hover:bg-slate-800 hover:border-purple-500/30 rounded-xl transition-all cursor-pointer">
        {/* Rank Number */}
        <div
          className={`text-3xl md:text-4xl font-black italic w-12 md:w-16 text-center shrink-0 ${rankColor}`}
        >
          {rank}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg md:text-xl font-bold truncate group-hover:text-purple-400 transition-colors">
              {item.title}
            </h3>
            {isTop3 && (
              <span className="hidden md:inline-block px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase rounded">
                Hot
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-mono uppercase">
            <span>{item.category}</span>
            <span>•</span>
            <span>{item.voteCount} votes</span>
          </div>
        </div>

        {/* Score */}
        <div className="text-right">
          <div className="text-2xl font-bold group-hover:text-white transition-colors">
            {item.avgScore}
          </div>
          <div className="text-[10px] text-slate-600 font-bold uppercase">
            Avg Score
          </div>
        </div>
      </div>
    </Link>
  );
}
