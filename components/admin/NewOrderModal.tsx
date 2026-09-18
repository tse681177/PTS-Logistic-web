"use client";

import React, { useState, useEffect } from "react";
import { MilestoneStep, MILESTONES } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import { Plus, X, Lock } from "lucide-react";

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export default function NewOrderModal({ isOpen, onClose, onSuccess }: NewOrderModalProps) {
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
  const [form, setForm] = useState({
    product_name: "1-р зэргийн буудай (Алтай)",
    quantity_tons: 60,
    destination: "Улаанбаатар, Толгойт өртөө",
    transport_type: "rail" as "truck" | "rail",
    status: 1 as MilestoneStep,
    current_location: "ОХУ-ын үйлдвэрт хуваарь батлагдсан",
    departure_date: new Date().toISOString().substring(0, 10),
    estimated_arrival: "",
    customer_company: "",
    customer_contact_person: "",
    customer_phone: "",
    contract_no: "",
    payment_status: "paid" as "paid" | "advance_50" | "pending",
    driver_name: "",
    driver_phone: "",
    vehicle_plate: "",
    container_number: "",
    admin_notes: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `PTS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    await b2bStore.createAdminOrder({
      order_code: newCode,
      product_name: form.product_name,
      quantity_tons: Number(form.quantity_tons),
      destination: form.destination,
      transport_type: form.transport_type,
      status: form.status,
      status_label: MILESTONES[form.status].label,
      current_location: form.current_location,
      departure_date: form.departure_date,
      estimated_arrival: form.estimated_arrival || "Хуваарийн дагуу",
      customer_company: form.customer_company || "Гэрээт байгууллага",
      customer_contact_person: form.customer_contact_person || "-",
      customer_phone: form.customer_phone || "-",
      contract_no: form.contract_no || `CTR-2026-${Math.floor(100 + Math.random() * 900)}`,
      payment_status: form.payment_status,
      driver_name: form.driver_name || "-",
      driver_phone: form.driver_phone || "-",
      vehicle_plate: form.vehicle_plate || "-",
      container_number: form.container_number || "-",
      admin_notes: form.admin_notes || ""
    });

    onSuccess(newCode);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-8 cursor-default"
      >
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Plus className="w-5 h-5 text-sky-400" />
            <span>Шинэ Утасны Захиалга Бүртгэх</span>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider pb-1 border-b border-slate-800">
            1. Нийтийн Мэдээлэл (Захиалагчид харагдах):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Бүтээгдэхүүн:</label>
              <input
                type="text"
                required
                value={form.product_name}
                onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Хэмжээ (Тонн):</label>
              <input
                type="number"
                required
                value={form.quantity_tons}
                onChange={(e) => setForm({ ...form, quantity_tons: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Очих цэг / Терминал:</label>
              <input
                type="text"
                required
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                placeholder="Жишээ: Улаанбаатар, Толгойт өртөө"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Тээврийн төрөл:</label>
              <select
                value={form.transport_type}
                onChange={(e) => setForm({ ...form, transport_type: e.target.value as "truck" | "rail" })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="rail">Төмөр зам (Вагон / Чингэлэг)</option>
                <option value="truck">Авто тээвэр (Шууд авто цуваа)</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider pt-3 pb-1 border-b border-slate-800 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>2. Зөвхөн Админ Нууцлалтай Мэдээлэл (Нийтэд харагдахгүй):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Захиалагч байгууллага:</label>
              <input
                type="text"
                required
                value={form.customer_company}
                onChange={(e) => setForm({ ...form, customer_company: e.target.value })}
                placeholder="Жишээ: Алтан Тариа ХХК"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Захиалагчийн утас:</label>
              <input
                type="tel"
                required
                value={form.customer_phone}
                onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                placeholder="9911-XXXX"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
            <div>
              <label className="block text-emerald-300 font-semibold mb-1 text-xs">Жолоочийн нэр:</label>
              <input
                type="text"
                required
                value={form.driver_name}
                onChange={(e) => setForm({ ...form, driver_name: e.target.value })}
                placeholder="Жишээ: Б.Батболд"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-emerald-300 font-semibold mb-1 text-xs">Жолоочийн утасны дугаар:</label>
              <input
                type="tel"
                required
                value={form.driver_phone}
                onChange={(e) => setForm({ ...form, driver_phone: e.target.value })}
                placeholder="Жишээ: 9908-1234"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-emerald-300 font-semibold mb-1 text-xs">Машины улсын дугаар:</label>
              <input
                type="text"
                value={form.vehicle_plate}
                onChange={(e) => setForm({ ...form, vehicle_plate: e.target.value })}
                placeholder="Жишээ: 4589 УБА"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-emerald-300 font-semibold mb-1 text-xs">Вагон / Чингэлэгийн дугаар:</label>
              <input
                type="text"
                value={form.container_number}
                onChange={(e) => setForm({ ...form, container_number: e.target.value })}
                placeholder="Жишээ: RZD-54219803"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">Одоогийн байршил / Тэмдэглэл:</label>
            <input
              type="text"
              value={form.current_location}
              onChange={(e) => setForm({ ...form, current_location: e.target.value })}
              placeholder="Жишээ: Дархан өртөөгөөр дамжин өнгөрсөн"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Болих
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/30"
            >
              Бүртгэх & Түгжигдсэн Код Үүсгэх
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
