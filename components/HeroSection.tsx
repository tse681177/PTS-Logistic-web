"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";

export default function HeroSection() {
  const { getContent } = useSiteContent();

  return (
    <section className="relative py-20 sm:py-24 border-b border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Minimal Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-medium text-sky-300 mb-6">
          <span>{getContent("hero_badge", "🌾 ОХУ - Монгол Улс | Үр Тариа, Малын Тэжээлийн Бөөний Худалдаа")}</span>
        </div>

        {/* Minimal Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {getContent("hero_title", "Их Хэмжээний Үр Тариа, Малын Тэжээлийн Бөөний Худалдаа")}
        </h1>

        {/* Minimal Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {getContent("hero_subtitle", "ОХУ-ын Алтай хязгаар, Сибирийн шилдэг үйлдвэр, элеваторуудаас хүнсний улаан буудай, малын тэжээлийн хивэг, шар буурцагны шротыг үйлдвэрийн бөөний үнээр Монголын зах зээлд шууд нийлүүлнэ.")}
        </p>

        {/* 3 Clean Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
          <a
            href="#contact"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/25"
          >
            <span>{getContent("hero_cta_primary", "Бөөний захиалга өгөх")}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#products"
            className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors"
          >
            {getContent("hero_cta_secondary", "Бүтээгдэхүүний жагсаалт & Үнэ")}
          </a>
          <a
            href="#public-orders"
            className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors"
          >
            Нийлүүлэлтийн явц (Самбар)
          </a>
        </div>

        {/* Clean stats row */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="font-mono text-2xl font-bold text-white">
              {getContent("hero_stat1_value", "150,000+ тн")}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {getContent("hero_stat1_label", "Жилийн бөөний нийлүүлэлт")}
            </div>
          </div>
          <div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-sky-400">
              {getContent("hero_stat2_value", "Шууд Үйлдвэрээс")}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {getContent("hero_stat2_label", "Бөөний жишиг үнэ")}
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-white">
              {getContent("hero_stat3_value", "SGS / МХЕГ")}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {getContent("hero_stat3_label", "100% Лаборатори баталгаа")}
            </div>
          </div>
          <div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-sky-400">
              {getContent("hero_stat4_value", "Толгойт & Дархан")}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {getContent("hero_stat4_label", "Өөрийн элеватор бааз")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
