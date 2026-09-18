"use client";

import React, { useState, useEffect } from "react";
import { PublicOrder, MilestoneStep, MILESTONES } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Train, 
  Truck, 
  Calendar, 
  ShieldAlert, 
  ShieldCheck, 
  Package, 
  AlertCircle,
  RotateCw
} from "lucide-react";

interface OrderTrackingSectionProps {
  searchedCode?: string;
}

export default function OrderTrackingSection({ searchedCode }: OrderTrackingSectionProps) {
  const [inputCode, setInputCode] = useState(searchedCode || "PTS-2026-8942");
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedOnce, setSearchedOnce] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTrack = async (codeToSearch: string) => {
    const code = codeToSearch.trim();
    if (!code) {
      setErrorMessage("Захиалгын код оруулна уу.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSearchedOnce(true);

    try {
      const found = await b2bStore.trackOrderByCode(code);
      if (found) {
        setOrder(found);
      } else {
        setOrder(null);
        setErrorMessage(`"${code}" кодтой захиалга олдсонгүй. Кодоо зөв эсэхийг шалгана уу.`);
      }
    } catch (err) {
      setErrorMessage("Хайлт хийх явцад алдаа гарлаа.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchedCode) {
      setInputCode(searchedCode);
      handleTrack(searchedCode);
    } else {
      // Default load initial order for immediate preview
      handleTrack("PTS-2026-8942");
    }
  }, [searchedCode]);

  // Subscribe to updates if store changes
  useEffect(() => {
    const unsub = b2bStore.subscribe(() => {
      if (order?.order_code) {
        handleTrack(order.order_code);
      }
    });
    return () => unsub();
  }, [order?.order_code]);

  const steps: MilestoneStep[] = [1, 2, 3, 4, 5];

  return (
    <section id="tracking" className="scroll-mt-24 py-20 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3">
            <Search className="w-3.5 h-3.5" />
            <span>Захиалга шалгах</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Тээвэрлэлтийн Явцыг Бодит Хугацаанд Хянах
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Захиалгын баталгаажсан 12 оронтой кодоо оруулан ачааны замнал, одоогийн байршил болон хүрэх хугацааг шууд шалгана уу.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack(inputCode);
            }}
            className="flex flex-col sm:flex-row gap-2 bg-slate-900 p-2.5 rounded-2xl border border-slate-800 shadow-xl"
          >
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Жишээ: PTS-2026-8942"
                className="w-full bg-transparent border-0 py-3 pl-3 pr-2 text-base font-mono text-white placeholder-slate-500 focus:outline-none uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 shadow-md shadow-emerald-900/30"
            >
              {isLoading ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Явц шалгах</span>
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span>Шууд сонгож харах:</span>
            {["PTS-2026-8942", "PTS-2026-8945", "PTS-2026-8950", "PTS-2026-8930"].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setInputCode(sample);
                  handleTrack(sample);
                }}
                className={`px-2.5 py-1 rounded-md font-mono text-xs transition-colors border ${
                  inputCode === sample
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                {sample}
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Tracking Details & Stepper Result */}
        {order && (
          <div className="max-w-4xl mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-wider">
                    {order.order_code}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {order.status_label}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                  <span>Бүтээгдэхүүн:</span>
                  <strong className="text-slate-200">{order.product_name}</strong>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-bold">{order.quantity_tons} тонн</span>
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
                  {order.transport_type === "rail" ? (
                    <>
                      <Train className="w-4 h-4 text-sky-400" />
                      <span>Төмөр зам (Вагон тээвэр)</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <span>Авто тээвэр (Шууд цуваа)</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 5-Step Visual Stepper */}
            <div className="py-8">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-6">
                Тээврийн явцын үе шат (5 шатлалт)
              </h3>
              
              <div className="relative">
                {/* Desktop Stepper Bar */}
                <div className="hidden md:block absolute top-6 left-10 right-10 h-1 bg-slate-800 -z-0">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-700"
                    style={{
                      width: `${((order.status - 1) / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
                  {steps.map((step) => {
                    const info = MILESTONES[step];
                    const isCompleted = step < order.status;
                    const isCurrent = step === order.status;
                    const isUpcoming = step > order.status;

                    return (
                      <div
                        key={step}
                        className={`flex md:flex-col items-center md:text-center gap-4 md:gap-3 p-3 rounded-xl transition-all ${
                          isCurrent
                            ? "bg-emerald-500/10 border border-emerald-500/30 md:bg-transparent md:border-0"
                            : ""
                        }`}
                      >
                        {/* Circle Indicator */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all shadow-md ${
                            isCompleted
                              ? "bg-emerald-600 text-white shadow-emerald-900/40"
                              : isCurrent
                              ? "bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 font-black animate-pulse"
                              : "bg-slate-800 text-slate-500 border border-slate-700"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <span>{step}</span>
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="md:w-full">
                          <p
                            className={`text-sm font-bold ${
                              isCurrent
                                ? "text-emerald-400"
                                : isCompleted
                                ? "text-slate-200"
                                : "text-slate-500"
                            }`}
                          >
                            {info.label}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 hidden md:block leading-snug">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Current Safe Status & Checkpoint Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Одоогийн байршил / Тээврийн цэг</span>
                </div>
                <p className="text-sm font-medium text-slate-200">
                  {order.current_location || "Хяналтын пост дээр бүртгэгдсэн"}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Очих цэг: <strong className="text-slate-200">{order.destination}</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Тээврийн хуваарь</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Илгээгдсэн:</span>
                    <p className="font-mono text-slate-200 font-semibold mt-0.5">
                      {order.departure_date || "Төлөвлөгдсөн"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Хүрэх хугацаа:</span>
                    <p className="font-mono text-emerald-400 font-bold mt-0.5">
                      {order.estimated_arrival || "Тооцоолж байна"}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Сүүлд шинэчлэгдсэн: {order.updated_at}
                </p>
              </div>
            </div>

            {/* STRICT PRIVACY BANNER */}
            <div className="mt-6 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200 font-semibold">
                  Мэдээллийн аюулгүй байдал & Нууцлалын журам:
                </strong>{" "}
                B2B гэрээт тээврийн аюулгүй байдлын үүднээс Жолоочийн нэр, утасны дугаар, тээврийн хэрэгслийн улсын дугаар болон чингэлэгийн дугаар нь зөвхөн эрх бүхий Диспетчер болон Админ талд харагдах бөгөөд нийтийн ил тод сүлжээнд хэзээ ч нийтлэгдэхгүй болохыг баталгаажуулж байна.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
