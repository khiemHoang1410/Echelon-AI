"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:text-purple-400 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
    >
      {pending ? (
        <>
          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          Đang phân tích...
        </>
      ) : (
        "⚡ TRIỆU HỒI HỘI ĐỒNG AI"
      )}
    </button>
  );
}
