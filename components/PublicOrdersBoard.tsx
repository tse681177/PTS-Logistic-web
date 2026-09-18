"use client";

import React, { useState, useEffect } from "react";
import { PublicOrder } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import { Table, Search, Train, Truck, ShieldCheck, Clock } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";

export default function PublicOrdersBoard() {
  const { getContent } = useSiteContent();
  const [orders, setOrders] = useState<PublicOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");

  useEffect(() => {
    b2bStore.initializeIfEmpty();
    const loadOrders = async () => {
      const data = await b2bStore.getPublicOrders();
      setOrders(data);
    };
    loadOrders();
    const unsub = b2bStore.subscribe(loadOrders);
    return () => unsub();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <section id="public-orders" className="scroll-mt-24 py-16 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-semibold mb-2">
              <Table className="w-3.5 h-3.5" />
              <span>Нийлүүлэлтийн самбар</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {getContent("orders_board_title", "Бөөний Нийлүүлэлт & Түгээлтийн Явц")}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {getContent("orders_board_subtitle", "Харилцагч үйлдвэр, аж ахуй нэгжүүдийн төв бааз болон ОХУ-аас ачигдсан бөөний захиалгуудын явц.")}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Жолооч, улсын дугаар нийтэд нууцлагдсан</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3 mb-4 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Захиалгын код, очих газар, бүтээгдэхүүнээр хайх..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              Бүгд ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter(3)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 3
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              Замдаа яваа
            </button>
            <button
              onClick={() => setStatusFilter(4)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 4
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              Зангилаанд ирсэн
            </button>
            <button
              onClick={() => setStatusFilter(5)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 5
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              Хүргэгдсэн
            </button>
          </div>
        </div>

        {/* Minimal Orders Table */}
        <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
          <div className="flex md:hidden items-center justify-between px-3.5 py-1.5 bg-slate-900/60 border-b border-slate-800 text-[11px] text-slate-400">
            <span>Нийлүүлэлтийн жагсаалт</span>
            <span className="text-sky-400 font-medium">← Хөндлөн гүйлгэж харах →</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Код</th>
                  <th className="py-3 px-4">Бүтээгдэхүүн</th>
                  <th className="py-3 px-4">Хэмжээ</th>
                  <th className="py-3 px-4">Очих цэг / Терминал</th>
                  <th className="py-3 px-4">Тээвэр</th>
                  <th className="py-3 px-4">Төлөв</th>
                  <th className="py-3 px-4">Хүрэх / Биелэгдсэн хугацаа</th>
                  <th className="py-3 px-4 text-right">Шинэчлэгдсэн</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      Захиалга олдсонгүй.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                        {ord.order_code}
                      </td>
                      <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                        {ord.product_name}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono font-semibold text-slate-200">
                        {ord.quantity_tons} тн
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {ord.destination}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {ord.transport_type === "rail" ? (
                          <span className="inline-flex items-center gap-1 text-slate-300">
                            <Train className="w-3.5 h-3.5 text-sky-400" /> Төмөр зам
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-300">
                            <Truck className="w-3.5 h-3.5 text-blue-400" /> Авто тээвэр
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            ord.status === 5
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : ord.status === 4
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : ord.status === 3
                              ? "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {ord.status_label}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span>{ord.estimated_arrival || "Хуваарийн дагуу"}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-sans">
                          {ord.status === 5 ? "Биелэгдсэн хугацаа" : "Тооцоот хүрэх"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-right whitespace-nowrap font-mono text-[11px]">
                        {ord.updated_at}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
