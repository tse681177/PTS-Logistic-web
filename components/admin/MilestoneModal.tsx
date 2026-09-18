"use client";

import React, { useState, useEffect } from "react";
import { AdminOrder, MilestoneStep, MILESTONES } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import { X, CheckCircle2 } from "lucide-react";

interface MilestoneModalProps {
  order: AdminOrder | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export default function MilestoneModal({ order, onClose, onSuccess }: MilestoneModalProps) {
  const [status, setStatus] = useState<MilestoneStep>(1);
  const [currentLocation, setCurrentLocation] = useState("");
  const [estimatedArrival, setEstimatedArrival] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setCurrentLocation(order.current_location);
      setEstimatedArrival(order.estimated_arrival || "");
    }
  }, [order]);

  useEffect(() => {
    if (!order) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [order, onClose]);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await b2bStore.updateOrderMilestone(
      order.id,
      status,
      currentLocation,
      estimatedArrival
    );
    onSuccess(`Захиалга ${order.order_code}-ийн явц шинэчлэгдлээ.`);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 cursor-default"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Тээврийн Явцын Шатлал Шинэчлэх</h3>
            <p className="text-xs font-mono text-sky-400 mt-0.5">
              {order.order_code} ({order.product_name})
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
          >
            <X className="w-4 h-4" />
            <span>Хаах (Esc)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Үе шат сонгох (1-5):
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value) as MilestoneStep)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-semibold"
            >
              <option value={1}>Шат 1: Баталгаажсан (Гэрээ, төлбөр баталгаажсан)</option>
              <option value={2}>Шат 2: Ачигдаж байгаа (Элеваторт ачилт хийгдэж буй)</option>
              <option value={3}>Шат 3: Замдаа явж байна (Хил нэвтэрсэн, замд яваа)</option>
              <option value={4}>Шат 4: Тээврийн зангилаанд ирсэн (УБ терминалд буусан)</option>
              <option value={5}>Шат 5: Хүргэгдсэн (Агуулахад хүлээлгэн өгсөн)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Одоогийн байршил & Тэмдэглэл:
            </label>
            <input
              type="text"
              required
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              placeholder="Жишээ: Дархан өртөөгөөр дамжин өнгөрсөн"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Баримжаа хүрэх хугацаа:
            </label>
            <input
              type="text"
              value={estimatedArrival}
              onChange={(e) => setEstimatedArrival(e.target.value)}
              placeholder="Жишээ: 2026-09-12 16:00"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Болих
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
            >
              Хадгалах
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
