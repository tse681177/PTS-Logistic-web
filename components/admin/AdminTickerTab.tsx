"use client";

import React from "react";
import { TickerItem } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import { Plus, Trash2 } from "lucide-react";

interface AdminTickerTabProps {
  tickerItems: TickerItem[];
  onOpenAdd: () => void;
  onDelete: (id: string, name: string) => void;
}

export default function AdminTickerTab({
  tickerItems,
  onOpenAdd,
  onDelete
}: AdminTickerTabProps) {
  return (
    <div className="mt-5 space-y-4">
      {/* Header row with Add button in the TOP-RIGHT corner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white">Шууд Ханш & Үнэ</h3>
          <p className="text-xs text-slate-400">Нүүр хуудасны гүйдэг мөрөнд харагдах түүхий эд, валютын үнэ (хувьгүй)</p>
        </div>

        {/* TOP-RIGHT BUTTON: ADD TICKER ITEM */}
        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Шинэ Ханш Нэмэх</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tickerItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  {item.type === "commodity" ? "Түүхий эд" : "Валютын ханш"}
                </span>
                {/* DELETE TICKER ITEM */}
                <button
                  type="button"
                  onClick={() => onDelete(item.id, item.name)}
                  className="text-rose-400 hover:text-rose-300 p-1 text-[10px] flex items-center gap-0.5"
                  title="Устгах"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Хасах</span>
                </button>
              </div>

              <strong className="text-sm text-white font-bold block mb-2">{item.name}</strong>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Үнэ / Ханш:</label>
                  <input
                    type="number"
                    step="any"
                    value={item.price}
                    onChange={(e) => {
                      b2bStore.updateTickerItem({ ...item, price: Number(e.target.value) });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Нэгж:</label>
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => {
                      b2bStore.updateTickerItem({ ...item, unit: e.target.value });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Идэвхтэй:</span>
              <input
                type="checkbox"
                checked={item.is_active}
                onChange={(e) => {
                  b2bStore.updateTickerItem({ ...item, is_active: e.target.checked });
                }}
                className="rounded accent-blue-600"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
