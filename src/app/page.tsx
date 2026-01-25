import NewsFeed from "@/components/simulation/NewsFeed";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            ECHELON SOCIAL
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-400">LIVE SIMULATION</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20">
        <NewsFeed />
      </div>
    </main>
  );
}
