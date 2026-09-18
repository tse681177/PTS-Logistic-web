"use client";

import React from "react";
import { Product } from "@/lib/types";
import { Plus, Edit3, Trash2 } from "lucide-react";

interface AdminProductsTabProps {
  products: Product[];
  onOpenAdd: () => void;
  onOpenEdit: (prod: Product) => void;
  onDelete: (id: string, name: string) => void;
}

export default function AdminProductsTab({
  products,
  onOpenAdd,
  onOpenEdit,
  onDelete
}: AdminProductsTabProps) {
  return (
    <div className="mt-5 space-y-4">
      {/* Header row with Add button in the TOP-RIGHT corner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white">Бүтээгдэхүүний Мэдээлэл</h3>
          <p className="text-xs text-slate-400">Нэр, тайлбар, зураг болон PDF файл аттач хийх</p>
        </div>

        {/* TOP-RIGHT BUTTON: ADD PRODUCT */}
        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Шинэ Бүтээгдэхүүн Нэмэх</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-sky-400">
                  {prod.category === "ready" ? "Бэлэн бараа" : "Урьдчилсан захиалга"}
                </span>
                {/* DELETE BUTTON (хуучнаас нь хасах) */}
                <button
                  type="button"
                  onClick={() => onDelete(prod.id, prod.title)}
                  className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/40 text-xs flex items-center gap-1"
                  title="Устгах"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="text-[10px]">Хасах</span>
                </button>
              </div>

              {prod.image_url ? (
                <div className="h-32 w-full bg-slate-950 rounded-lg overflow-hidden mb-3">
                  <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-20 w-full bg-slate-950 rounded-lg flex items-center justify-center text-slate-600 text-xs mb-3">
                  Зураггүй
                </div>
              )}

              <h4 className="font-bold text-white text-sm">{prod.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prod.description}</p>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Үнэ:</span>
                <span className="font-mono font-bold text-sky-400 text-sm">
                  {prod.price_per_ton.toLocaleString("mn-MN")} ₮/тн
                </span>
              </div>

              <div className="mt-2 text-[11px] text-slate-400">
                PDF файл: <span className="font-mono text-slate-300">{prod.lab_cert_pdf_url || "Байхгүй"}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => onOpenEdit(prod)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-3 h-3 text-sky-400" />
                <span>Засах & Аттач удирдах</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
