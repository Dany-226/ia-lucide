'use client';

import { useState } from 'react';

interface FaqItemProps {
  item: { q: string; a: string };
}

export default function MetiersFaqItem({ item }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#0e0e0e]/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-bold text-[#1c1c17] leading-snug">
          {item.q}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="text-[#c9a84c] mt-0.5 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d="M4 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <p className="text-base text-[#6b6b6b] leading-relaxed pb-5 pr-8">
          {item.a}
        </p>
      )}
    </div>
  );
}
