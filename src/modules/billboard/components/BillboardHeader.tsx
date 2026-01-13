export function BillboardHeader() {
	return (
		<header className="flex justify-between items-end mb-12 border-b border-white/10 pb-6 relative">
			{/* Background Glow */}
			<div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none -z-10" />

			<div>
				<h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
					Billboard
				</h1>
				<p className="text-purple-400 font-mono text-sm tracking-widest mt-2 uppercase">
					AI Council • Top 100 Charts
				</p>
			</div>
			<div className="text-right hidden md:block">
				<div className="text-xs text-slate-500 font-mono">NEXT UPDATE</div>
				<div className="text-xl font-bold font-mono text-slate-300">
					REALTIME
				</div>
			</div>
		</header>
	);
}
