"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import LabCertificateModal from "./LabCertificateModal";
import { Package, FileText, ArrowRight } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";

export default function ProductsSection() {
  const { getContent } = useSiteContent();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "ready" | "preorder">("all");
  const [activeLabProduct, setActiveLabProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    const data = await b2bStore.getProducts();
    setProducts(data);
  };

  useEffect(() => {
    b2bStore.initializeIfEmpty();
    loadProducts();
    const unsub = b2bStore.subscribe(loadProducts);
    return () => unsub();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (categoryFilter === "all") return true;
    return p.category === categoryFilter;
  });

  return (
    <section id="products" className="scroll-mt-24 py-16 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-semibold mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>Бөөний Бүтээгдэхүүн</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {getContent("products_title", "Бүтээгдэхүүний Бөөний Үнэ & Шинжилгээ")}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {getContent("products_subtitle", "Хүнсний буудай, малын тэжээл, уургийн шротын үйлдвэрийн бөөний үнэ, лабораторийн сорилтын протокол.")}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800 self-start md:self-auto text-xs font-medium">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                categoryFilter === "all" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Бүгд ({products.length})
            </button>
            <button
              onClick={() => setCategoryFilter("ready")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                categoryFilter === "ready" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Бэлэн бараа
            </button>
            <button
              onClick={() => setCategoryFilter("preorder")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                categoryFilter === "preorder" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Урьдчилсан захиалга
            </button>
          </div>
        </div>

        {/* Top-to-bottom Vertical List */}
        <div className="flex flex-col space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/80 rounded-xl border border-slate-800 text-slate-500 text-xs">
              Бүтээгдэхүүн олдсонгүй.
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const isReady = prod.category === "ready";
              return (
                <div
                  key={prod.id}
                  className="bg-slate-950/80 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center gap-5"
                >
                  {/* Thumbnail & Category Badge */}
                  {prod.image_url ? (
                    <div className="relative w-full lg:w-48 h-44 lg:h-36 shrink-0 rounded-lg overflow-hidden bg-slate-900">
                      <img
                        src={prod.image_url}
                        alt={prod.title}
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute top-2 left-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                            isReady ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
                          }`}
                        >
                          {isReady ? "Бэлэн бараа" : "Урьдчилсан захиалга"}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  {/* Product Details & Specs */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-medium text-sky-400">{prod.origin}</span>
                      <span>•</span>
                      <span>{prod.packaging}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {prod.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 max-w-2xl">
                      {prod.description}
                    </p>

                    {/* Spec tags pills */}
                    {prod.specs && Object.keys(prod.specs).length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {prod.specs.gluten && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800">
                            Цавуулаг: <strong className="ml-1 text-white">{prod.specs.gluten}</strong>
                          </span>
                        )}
                        {prod.specs.protein && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800">
                            Уураг: <strong className="ml-1 text-white">{prod.specs.protein}</strong>
                          </span>
                        )}
                        {prod.specs.moisture && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800">
                            Чийглэг: <strong className="ml-1 text-white">{prod.specs.moisture}</strong>
                          </span>
                        )}
                        {prod.specs.foreign_matter && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800">
                            Хольц: <strong className="ml-1 text-white">{prod.specs.foreign_matter}</strong>
                          </span>
                        )}
                        {prod.specs.test_weight && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800">
                            Натура: <strong className="ml-1 text-white">{prod.specs.test_weight}</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pricing & Actions Column */}
                  <div className="lg:w-64 shrink-0 lg:border-l lg:border-slate-800/80 lg:pl-5 flex flex-col justify-between pt-3 lg:pt-0 border-t border-slate-800 lg:border-t-0 space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        {isReady ? "Бөөний үнэ / Тонн" : "Жишиг бөөний үнэ / Тонн"}
                      </span>
                      <div className="font-mono text-xl font-bold text-sky-400">
                        {prod.price_per_ton.toLocaleString("mn-MN")} ₮
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                        {isReady ? `Агуулахад: ${prod.in_stock_tons} тн` : `Мин захиалга: ${prod.min_order_tons} тн`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveLabProduct(prod)}
                        className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-medium border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-400" />
                        <span>Шинжилгээ (PDF)</span>
                      </button>
                      <a
                        href="#contact"
                        className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-blue-500/20"
                      >
                        <span>Шууд захиалах</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {activeLabProduct && (
        <LabCertificateModal
          product={activeLabProduct}
          onClose={() => setActiveLabProduct(null)}
        />
      )}
    </section>
  );
}
