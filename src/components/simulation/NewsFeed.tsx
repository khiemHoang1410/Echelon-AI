"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale"; // Để hiển thị "5 phút trước" bằng tiếng Việt

interface Post {
  id: string;
  content: string;
  topic: string;
  likeCount: number;
  createdAt: string;
  author: {
    name: string;
    avatar: string;
    tier: string;
  };
  _count: { comments: number };
}

export default function NewsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm fetch dữ liệu
  const fetchFeed = async () => {
    try {
      const res = await fetch("/api/simulation/feed");
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Tự động refresh sau mỗi 5 giây để xem bài mới
  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && posts.length === 0)
    return <div className="text-center p-10 text-white">Đang tải drama...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg hover:border-gray-700 transition-colors"
        >
          {/* Header: Avatar + Name */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full bg-gray-700 object-cover"
              />
              {/* Badge cho Elite */}
              {post.author.tier === "ELITE" && (
                <span className="absolute -bottom-1 -right-1 bg-blue-500 text-[10px] text-white px-1.5 py-0.5 rounded-full border border-gray-900 font-bold">
                  ✓
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-100 truncate">
                  {post.author.name}
                </h3>
                {post.author.tier === "ELITE" && (
                  <span className="text-blue-400 text-xs bg-blue-400/10 px-2 py-0.5 rounded">
                    KOL
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
                {post.topic && ` • #${post.topic}`}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </div>

          {/* Action Bar (Fake buttons) */}
          <div className="flex items-center justify-between border-t border-gray-800 pt-3 text-gray-500 text-sm">
            <button className="flex items-center gap-2 hover:text-red-500 transition-colors group">
              <span>❤️</span>
              <span>{post.likeCount.toLocaleString()}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <span>💬</span>
              <span>{post._count.comments} bình luận</span>
            </button>

            <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
              <span>🔄 Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
