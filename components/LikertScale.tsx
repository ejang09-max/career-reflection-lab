"use client";

import { cn } from "@/lib/utils";

export function LikertScale({ value, onChange }: { value?: 1 | 2 | 3 | 4 | 5; onChange: (value: 1 | 2 | 3 | 4 | 5) => void }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score as 1 | 2 | 3 | 4 | 5)}
          className={cn(
            "flex h-11 min-w-11 items-center justify-center rounded-md border bg-white text-sm font-bold transition hover:border-indigo-300 hover:bg-indigo-50 sm:h-12",
            value === score && "border-indigo-600 bg-indigo-600 text-white shadow-md"
          )}
        >
          {score}
        </button>
      ))}
    </div>
  );
}
