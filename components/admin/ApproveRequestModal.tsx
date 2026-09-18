"use client";

import React, { useState, useEffect } from "react";
import { OrderRequest } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import { X, CheckCircle2, Truck, ShieldAlert, Calendar, FileCheck2, Building } from "lucide-react";

interface ApproveRequestModalProps {
  request: OrderRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderCode: string) => void;
}

export default function ApproveRequestModal({
  request,
  isOpen,
  onClose,
  onSuccess
}: ApproveRequestModalProps) {
  const [transportType, setTransportType] = useState<"truck" | "rail">("truck");
  const [contractNo, setContractNo] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "advance_50" | "pending">("pending");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [containerNumber, setContainerNumber] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [estimatedArrival, setEstimatedArrival] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync form defaults when request changes
  useEffect(() => {
    if (request) {
      const year = new Date().getFullYear();
      const rand = Math.floor(100 + Math.random() * 900);
      setTransportType(request.quantity_tons >= 70 ? "rail" : "truck");
      setContractNo(`PTS-${year}-${rand}`);
      setPaymentStatus("pending");
      setDriverName("");
      setDriverPhone("");
      setVehiclePlate("");
      setContainerNumber("");
      setDepartureDate(new Date().toISOString().substring(0, 10));
      setEstimatedArrival("2-3 хоногт багтаж");
      setAdminNotes(request.notes ? `Хүсэлтийн тэмдэглэл: ${request.notes}` : "");
    }
  }, [request]);

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

  // Return null ONLY AFTER all hooks are called
  if (!isOpen || !request) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const newOrder = await b2bStore.approveOrderRequest(request.id, {
        transport_type: transportType,
        contract_no: contractNo,
        payment_status: paymentStatus,
        driver_name: driverName.trim() || "Хуваарилагдаж буй",
        driver_phone: driverPhone.trim() || "-",
        vehicle_plate: vehiclePlate.trim() || "-",
        container_number: containerNumber.trim() || "-",
        departure_date: departureDate,
        estimated_arrival: estimatedArrival,
        admin_notes: adminNotes
      });

      if (newOrder) {
        onSuccess(newOrder.order_code);
        onClose();
      } else {
        alert("Хүсэлтийг батлахад алдаа гарлаа.");
      }
    } catch (err) {
      console.error(err);
      alert("Алдаа гарлаа.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl my-8 cursor-default flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Хүсэлтийг Батлах & Захиалга Үүсгэх</h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                {request.request_code}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Хүсэлтийг шалгаж, гэрээ болон тээврийн өгөгдлийг баталгаажуулан албан ёсны захиалгад шилжүүлнэ.
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-5 flex-1 text-xs sm:text-sm">
          {/* Summary Box of Incoming Request */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>Ирүүлсэн хүсэлтийн мэдээлэл</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Ирсэн: {request.created_at}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Захиалагч компани:</span>
                <strong className="text-white text-sm">{request.customer_company}</strong>
                <div className="text-slate-300 font-mono mt-0.5">
                  {request.customer_contact_person} • {request.customer_phone}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Бүтээгдэхүүн & Тоо хэмжээ:</span>
                <strong className="text-white text-sm">{request.product_name}</strong>
                <div className="text-sky-400 font-mono font-bold mt-0.5">
                  {request.quantity_tons} тонн
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Очих цэг / Терминал:</span>
              <span className="text-slate-200">{request.destination}</span>
            </div>

            {request.notes && (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 italic">
                "{request.notes}"
              </div>
            )}
          </div>

          {/* Configuration to convert into Active Order */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Гэрээ & Тээврийн анхан шатны бүртгэл</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Тээврийн төрөл:</label>
                <select
                  value={transportType}
                  onChange={(e) => setTransportType(e.target.value as "truck" | "rail")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="truck">Авто тээвэр (Truck)</option>
                  <option value="rail">Төмөр зам (Rail wagon)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Гэрээний дугаар:</label>
                <input
                  type="text"
                  required
                  value={contractNo}
                  onChange={(e) => setContractNo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Төлбөрийн төлөв:</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as "paid" | "advance_50" | "pending")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="pending">Төлбөр хүлээгдэж буй (Pending)</option>
                  <option value="advance_50">Урьдчилгаа 50% баталгаажсан</option>
                  <option value="paid">Төлбөр бүрэн төлөгдсөн (Paid)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Жолоочийн нэр / Тээвэрлэгч:</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Б. Болд эсвэл Тээврийн компани"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Жолоочийн утас:</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="9911-XXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">
                  {transportType === "truck" ? "Машины улсын дугаар:" : "Машин / Чирэгчийн дугаар:"}
                </label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="Жишээ: 1234 УБЭ"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">
                  {transportType === "rail" ? "Вагон / Контейнерийн дугаар:" : "Чиргүүлийн дугаар:"}
                </label>
                <input
                  type="text"
                  value={containerNumber}
                  onChange={(e) => setContainerNumber(e.target.value)}
                  placeholder="Жишээ: WGN-58912345"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Товлосон огноо (Departure):</label>
                <input
                  type="text"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">Хүрэх хугацаа (Arrival):</label>
                <input
                  type="text"
                  value={estimatedArrival}
                  onChange={(e) => setEstimatedArrival(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 text-xs">Админ тэмдэглэл:</label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Захиалгын нэмэлт тохиролцоо, гэрээний тэмдэглэл..."
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
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isProcessing ? "Батлаж байна..." : "Батлах & Захиалга болгох"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
