"use client";

import React from "react";
import { Compass, Truck, Train, ArrowRight } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";

export default function LogisticsRouteSection() {
  const { getContent } = useSiteContent();

  return (
    <section id="logistics" className="scroll-mt-24 py-16 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Section Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>{getContent("logistics_badge", "Хүргэлтийн нөхцөл")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {getContent("logistics_title", "Бөөний Нийлүүлэлтийн Хүргэлтийн 2 Хэлбэр")}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {getContent("logistics_subtitle", "Бөөний захиалгын хэмжээ болон очих цэгээс хамааран үйлдвэр, фермийн агуулахад авто замаар шууд буулгах эсвэл төмөр замын вагоноор нийлүүлнэ.")}
          </p>
        </div>

        {/* 2 Routes Clean Minimal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Route A */}
          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20">
                  {getContent("logistics_route_a_badge", "Хэлбэр А: Авто замын шууд хүргэлт")}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {getContent("logistics_route_a_time", "24 - 48 цагт")}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {getContent("logistics_route_a_title", "Авто Тээврээр Шууд Хүргэх")}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {getContent("logistics_route_a_subtitle", "Боомтоос зам дагуух аймаг, сум, фермүүдэд шууд буулгах")}
                  </p>
                </div>
              </div>

              <div className="my-4 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                <div className="flex flex-wrap items-center gap-2">
                  {getContent("logistics_route_a_route", "Алтанбулаг / Сүхбаатар → Дархан → Зүүнхараа → Улаанбаатар")
                    .split(/→|->/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((stop, idx, arr) => (
                      <React.Fragment key={idx}>
                        <span className={idx === arr.length - 1 ? "text-sky-400 font-bold" : ""}>
                          {stop}
                        </span>
                        {idx < arr.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-sky-400">•</span>
                  <span><strong>Даац:</strong> {getContent("logistics_route_a_capacity", "25-50 тн тусгай тэвштэй болон битүү ачааны автомашинууд.")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400">•</span>
                  <span><strong>Давуу тал:</strong> {getContent("logistics_route_a_advantage", "Хил гарснаас 24-48 цагт зам дагуу байрлах фермүүдэд шууд буулгах боломжтой.")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400">•</span>
                  <span><strong>Зөвлөмж хэмжээ:</strong> {getContent("logistics_route_a_recommended", "20-100 тонн")}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Route B */}
          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                  {getContent("logistics_route_b_badge", "Хэлбэр Б: Төмөр замын вагон нийлүүлэлт")}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {getContent("logistics_route_b_time", "4 - 7 хоног")}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Train className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {getContent("logistics_route_b_title", "Төмөр замын вагон & чингэлэг нийлүүлэлт")}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {getContent("logistics_route_b_subtitle", "Улаанбаатар терминал болон зүүн бүсийн өртөөнүүдэд бөөнөөр буулгах")}
                  </p>
                </div>
              </div>

              <div className="my-4 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                <div className="flex flex-wrap items-center gap-2">
                  {getContent("logistics_route_b_route", "Наушки / ОХУ → Сүхбаатар өртөө → УБ (Толгойт/Амгалан) → Зүүн аймгууд")
                    .split(/→|->/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((stop, idx, arr) => (
                      <React.Fragment key={idx}>
                        <span className={idx === arr.length - 2 ? "text-blue-400 font-bold" : ""}>
                          {stop}
                        </span>
                        {idx < arr.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span><strong>Даац:</strong> {getContent("logistics_route_b_capacity", "60-70 тн даацын битүү чингэлэг.")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span><strong>Давуу тал:</strong> {getContent("logistics_route_b_advantage", "Их хэмжээний ачаанд тээврийн өртөг хямд, цаг агаарын эрсдэлгүй.")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span><strong>Зөвлөмж хэмжээ:</strong> {getContent("logistics_route_b_recommended", "50-70 тонн")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
