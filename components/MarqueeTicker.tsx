"use client";

import React, { useEffect, useState } from "react";
import { TickerItem } from "@/lib/types";
import { b2bStore } from "@/lib/store";

export default function MarqueeTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    b2bStore.initializeIfEmpty();
    const loadItems = async () => {
      const data = await b2bStore.getTickerItems();
      setItems(data.filter(i => i.is_active));
    };
    loadItems();

    const unsub = b2bStore.subscribe(loadItems);
    return () => unsub();
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-slate-950/90 border-b border-slate-800/80 text-xs py-2 overflow-hidden select-none relative z-50 backdrop-blur-sm">
      <div className="flex items-center">
        {/* Minimal left indicator */}
        <div className="flex-shrink-0 z-10 bg-slate-950/95 px-4 py-0.5 border-r border-slate-800 flex items-center gap-2 text-sky-400 font-semibold tracking-wider text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block animate-pulse"></span>
          <span>Бөөний үнэ, ханш:</span>
        </div>

        {/* Marquee Ticker Track without percentage changes */}
        <div className="relative w-full overflow-hidden flex whitespace-nowrap marquee-container">
          <div className="flex shrink-0 animate-marquee items-center gap-8 marquee-content pl-4">
            {items.map((item) => (
              <MinimalTickerItem key={item.id} item={item} />
            ))}
          </div>
          <div className="flex shrink-0 animate-marquee2 items-center gap-8 marquee-content pl-4">
            {items.map((item) => (
              <MinimalTickerItem key={`dup-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalTickerItem({ item }: { item: TickerItem }) {
  return (
    <div className="inline-flex items-center gap-2 text-slate-300 text-xs font-medium">
      <span className="text-slate-400">{item.name}:</span>
      <span className="font-bold text-white font-mono">
        {item.price.toLocaleString("mn-MN")} {item.unit}
      </span>
      <span className="text-slate-700 ml-2">/</span>
    </div>
  );
}
