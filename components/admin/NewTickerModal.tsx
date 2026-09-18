"use client";

import React, { useState, useEffect } from "react";
import { TickerItem } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import { X, Plus } from "lucide-react";

interface NewTickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export default function NewTickerModal({ isOpen, onClose, onSuccess }: NewTickerModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [unit, setUnit] = useState("₮/тн");
  const [type, setType] = useState<"commodity" | "currency">("commodity");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setPrice(0);
      setUnit("₮/тн");
      setType("commodity");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await b2bStore.createTickerItem({
      name: name.trim(),
      code: name.substring(0, 8).toUpperCase().replace(/\s+/g, "-"),
      price: Number(price),
      unit: unit.trim(),
      type,
      is_active: true
    });

    onSuccess(`"${name}" шинэ ханш амжилттай нэмэгдлээ.`);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 cursor-default"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-sky-400" />
            <span>Шинэ Ханш / Үнэ Нэмэх</span>
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
          >
            <X className="w-4 h-4" />
            <span>Хаах (Esc)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Төрөл:</label>
            <select
              value={type}
              onChange={(e) => {
                const val = e.target.value as "commodity" | "currency";
                setType(val);
                if (val === "currency") setUnit("₮");
                else setUnit("₮/тн");
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
            >
              <option value="commodity">Түүхий эдийн үнэ (Commodity)</option>
              <option value="currency">Валютын ханш (Currency)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Нэр:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "commodity" ? "Жишээ: Тэжээлийн арвай" : "Жишээ: EUR / MNT"}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Үнэ / Ханш:</label>
              <input
                type="number"
                step="any"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Нэгж:</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Болих
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
            >
              Нэмэх
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
