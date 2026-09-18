"use client";

import React, { useState } from "react";
import { OrderRequest } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import { 
  Inbox, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Clock, 
  ArrowUpRight, 
  FileText,
  AlertCircle
} from "lucide-react";

interface AdminRequestsTabProps {
  requests: OrderRequest[];
  onApproveClick: (request: OrderRequest) => void;
  onNotification: (msg: string) => void;
}

export default function AdminRequestsTab({
  requests,
  onApproveClick,
  onNotification
}: AdminRequestsTabProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const handleReject = async (req: OrderRequest) => {
    const reason = window.prompt(`Хүсэлт ${req.request_code}-ээс татгалзах шалтгаан (заавал биш):`, "Үнийн санал/Нөөц тохироогүй");
    if (reason !== null) {
      await b2bStore.rejectOrderRequest(req.id, reason);
      onNotification(`Хүсэлт ${req.request_code} татгалзсан төлөвт шилжлээ.`);
    }
  };

  const handleDelete = async (req: OrderRequest) => {
    if (window.confirm(`Хүсэлт ${req.request_code}-ийг системээс бүрмөсөн устгах уу?`)) {
      await b2bStore.deleteOrderRequest(req.id);
      onNotification(`Хүсэлт ${req.request_code} устгагдлаа.`);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesFilter = filterStatus === "all" || r.status === filterStatus;
    const q = search.toLowerCase().trim();
    if (!matchesFilter) return false;
    if (!q) return true;
    return (
      r.request_code.toLowerCase().includes(q) ||
      r.customer_company.toLowerCase().includes(q) ||
      r.customer_phone.toLowerCase().includes(q) ||
      r.customer_contact_person.toLowerCase().includes(q) ||
      r.product_name.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q)
    );
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-4">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setFilterStatus("pending")}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === "pending"
              ? "bg-amber-500/10 border-amber-500/50 shadow-sm shadow-amber-500/10"
              : "bg-slate-900 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Хүлээгдэж буй</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded font-mono">ШИНЭ</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">{pendingCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Шалгаж батлах шаардлагатай</div>
        </div>

        <div 
          onClick={() => setFilterStatus("approved")}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === "approved"
              ? "bg-emerald-500/10 border-emerald-500/50 shadow-sm shadow-emerald-500/10"
              : "bg-slate-900 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Баталсан захиалга</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">{approvedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Захиалгын төлөвт шилжсэн</div>
        </div>

        <div 
          onClick={() => setFilterStatus("rejected")}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === "rejected"
              ? "bg-rose-500/10 border-rose-500/50 shadow-sm shadow-rose-500/10"
              : "bg-slate-900 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Татгалзсан</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">{rejectedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Хүчингүй болсон хүсэлт</div>
        </div>

        <div 
          onClick={() => setFilterStatus("all")}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === "all"
              ? "bg-blue-500/10 border-blue-500/50 shadow-sm shadow-blue-500/10"
              : "bg-slate-900 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-sky-400 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Inbox className="w-3.5 h-3.5" />
              <span>Нийт хүсэлт</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">{requests.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Вэб сайтаас ирсэн бүх хүсэлт</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Хүсэлтийн код, байгууллага, утас, бүтээгдэхүүн, хүргэх цэгээр хайх..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === "pending"
                ? "bg-amber-600 text-white font-bold"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Хүлээгдэж буй ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("approved")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === "approved"
                ? "bg-emerald-600 text-white font-bold"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Баталсан ({approvedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("rejected")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === "rejected"
                ? "bg-rose-600 text-white font-bold"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Татгалзсан ({rejectedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === "all"
                ? "bg-blue-600 text-white font-bold"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Бүгд ({requests.length})
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Хүсэлтийн код & Огноо</th>
                <th className="py-3 px-4">Захиалагч & Утас</th>
                <th className="py-3 px-4">Бүтээгдэхүүн / Тонн</th>
                <th className="py-3 px-4">Очих цэг & Тайлбар</th>
                <th className="py-3 px-4">Төлөв</th>
                <th className="py-3 px-4 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Хүсэлт олдсонгүй.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-sky-400">{req.request_code}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{req.created_at}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <strong className="text-white block">{req.customer_company}</strong>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {req.customer_contact_person} • <span className="text-sky-300 font-mono">{req.customer_phone}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-200 block">{req.product_name}</span>
                      <span className="text-amber-400 font-mono font-bold">{req.quantity_tons} тонн</span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <span className="text-slate-300 block truncate" title={req.destination}>
                        {req.destination}
                      </span>
                      {req.notes && (
                        <span className="text-[11px] text-slate-400 block truncate italic" title={req.notes}>
                          "{req.notes}"
                        </span>
                      )}
                      {req.admin_notes && (
                        <span className="text-[11px] text-amber-300 block mt-0.5">
                          Санамж: {req.admin_notes}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {req.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          <span>Хүлээгдэж буй</span>
                        </span>
                      )}
                      {req.status === "approved" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Баталгаажсан</span>
                        </span>
                      )}
                      {req.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <XCircle className="w-3 h-3" />
                          <span>Татгалзсан</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => onApproveClick(req)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm shadow-emerald-500/20"
                              title="Батлах & Захиалгад шилжүүлэх"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Батлах & Захиалга болгох</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(req)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/30 text-slate-300 hover:text-rose-300 text-xs font-medium transition-colors"
                              title="Татгалзах"
                            >
                              Татгалзах
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(req)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Устгах"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
