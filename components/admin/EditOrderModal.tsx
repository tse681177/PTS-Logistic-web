"use client";

import React, { useState, useEffect } from "react";
import { AdminOrder, MilestoneStep, MILESTONES } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import { X, Save, ShieldAlert, Truck, Building, FileText, UserCheck } from "lucide-react";

interface EditOrderModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export default function EditOrderModal({ order, isOpen, onClose, onSuccess }: EditOrderModalProps) {
  const [formData, setFormData] = useState<AdminOrder | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync formData whenever order changes
  useEffect(() => {
    if (order) {
      setFormData({ ...order });
    } else {
      setFormData(null);
    }
  }, [order]);

  // Handle ESC key listener
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

  // Return null ONLY AFTER all hooks are evaluated
  if (!isOpen || !formData) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    try {
      await b2bStore.updateAdminOrder(formData);
      onSuccess(`Захиалга ${formData.order_code}-ийн мэдээлэл амжилттай шинэчлэгдлээ.`);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Захиалга хадгалахад алдаа гарлаа.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl my-8 cursor-default flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Захиалгын Бүртгэл Засах</h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/20 text-sky-400 font-bold">
                {formData.order_code}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Харилцагч, тээвэрлэгч, машин/вагон, явцын шатлал болон огнооны бүрэн засвар
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Хаах (Esc)</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-6 flex-1 text-xs sm:text-sm">
          {/* Section 1: Customer & Contract Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>1. Харилцагч & Гэрээний мэдээлэл</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Компанийн нэр:</label>
                <input
                  type="text"
                  required
                  value={formData.customer_company}
                  onChange={(e) => setFormData({ ...formData, customer_company: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Хариуцсан хүн:</label>
                <input
                  type="text"
                  value={formData.customer_contact_person || ""}
                  onChange={(e) => setFormData({ ...formData, customer_contact_person: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Холбогдох утас:</label>
                <input
                  type="text"
                  required
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Гэрээний дугаар:</label>
                <input
                  type="text"
                  value={formData.contract_no || ""}
                  onChange={(e) => setFormData({ ...formData, contract_no: e.target.value })}
                  placeholder="Жишээ: PTS-2026-089"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Төлбөрийн төлөв:</label>
                <select
                  value={formData.payment_status || "pending"}
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as "paid" | "advance_50" | "pending" })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                >
                  <option value="pending">Төлбөр хүлээгдэж буй (Pending)</option>
                  <option value="advance_50">Урьдчилгаа 50% баталгаажсан</option>
                  <option value="paid">Төлбөр бүрэн төлөгдсөн (Paid)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Commodity & Cargo Details */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>2. Бүтээгдэхүүн & Хүргэх чиглэл</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Бүтээгдэхүүн:</label>
                <input
                  type="text"
                  required
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Хэмжээ (Тонн):</label>
                <input
                  type="number"
                  required
                  value={formData.quantity_tons}
                  onChange={(e) => setFormData({ ...formData, quantity_tons: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Тээврийн төрөл:</label>
                <select
                  value={formData.transport_type}
                  onChange={(e) => setFormData({ ...formData, transport_type: e.target.value as "truck" | "rail" })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                >
                  <option value="truck">Авто тээвэр (Truck)</option>
                  <option value="rail">Төмөр зам (Rail wagon)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 text-xs">Очих цэг / Терминал / Хүлээн авах хаяг:</label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          {/* Section 3: Driver & Vehicle Info (Admin Confidential) */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>3. Тээвэрлэгч, Жолооч & Техникийн мэдээлэл</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded flex items-center gap-1 font-normal lowercase">
                <ShieldAlert className="w-3 h-3 text-amber-400" /> нийтийн самбарт харагдахгүй
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Жолоочийн нэр / Компани:</label>
                <input
                  type="text"
                  value={formData.driver_name || ""}
                  onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                  placeholder="Б. Болд (эсвэл Тээврийн компани)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Жолоочийн утас:</label>
                <input
                  type="text"
                  value={formData.driver_phone || ""}
                  onChange={(e) => setFormData({ ...formData, driver_phone: e.target.value })}
                  placeholder="9911-XXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">
                  {formData.transport_type === "truck" ? "Машины улсын дугаар:" : "Машин / Чирэгчийн дугаар:"}
                </label>
                <input
                  type="text"
                  value={formData.vehicle_plate || ""}
                  onChange={(e) => setFormData({ ...formData, vehicle_plate: e.target.value })}
                  placeholder="Жишээ: 1234 УБЭ"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">
                  {formData.transport_type === "rail" ? "Вагон / Контейнерийн дугаар:" : "Чиргүүлийн дугаар:"}
                </label>
                <input
                  type="text"
                  value={formData.container_number || ""}
                  onChange={(e) => setFormData({ ...formData, container_number: e.target.value })}
                  placeholder="Жишээ: WGN-58912345"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Ачигдсан / Гарсан огноо:</label>
                <input
                  type="text"
                  value={formData.departure_date || ""}
                  onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                  placeholder="YYYY-MM-DD"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Хүрэх хугацаа / Баримжаа:</label>
                <input
                  type="text"
                  value={formData.estimated_arrival || ""}
                  onChange={(e) => setFormData({ ...formData, estimated_arrival: e.target.value })}
                  placeholder="Жишээ: 2-3 хоногт эсвэл 2026-09-15"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Milestone Status & Location */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>4. Тээврийн явцын үе шат & Төлөв</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Үе шат сонгох (1-5):</label>
                <select
                  value={formData.status}
                  onChange={(e) => {
                    const newStatus = Number(e.target.value) as MilestoneStep;
                    setFormData({
                      ...formData,
                      status: newStatus,
                      status_label: MILESTONES[newStatus]?.label || "Баталгаажсан"
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500 text-xs"
                >
                  <option value={1}>Шат 1: Баталгаажсан (Гэрээ, төлбөр баталгаажсан)</option>
                  <option value={2}>Шат 2: Ачигдаж байгаа (Элеваторт ачилт хийгдэж буй)</option>
                  <option value={3}>Шат 3: Замдаа явж байна (Хил нэвтэрсэн, замд яваа)</option>
                  <option value={4}>Шат 4: Тээврийн зангилаанд ирсэн (УБ терминалд буусан)</option>
                  <option value={5}>Шат 5: Хүргэгдсэн (Агуулахад хүлээлгэн өгсөн)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Одоогийн байршил & Явцын тайлбар:</label>
                <input
                  type="text"
                  required
                  value={formData.current_location}
                  onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
                  placeholder="Жишээ: Дархан өртөөгөөр дамжин өнгөрсөн"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 text-xs">Админ тэмдэглэл (Дотоод хэрэгцээнд):</label>
              <textarea
                rows={2}
                value={formData.admin_notes || ""}
                onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                placeholder="Захиалгатай холбоотой онцгой зааварчилгаа, нэмэлт тохиролцоо..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900/95 py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Болих
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Хадгалж байна..." : "Өөрчлөлтийг хадгалах"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
