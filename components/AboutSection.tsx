"use client";

import React from "react";
import { Building2, Globe2, Warehouse, ShieldCheck, Layers } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";

export default function AboutSection() {
  const { getContent } = useSiteContent();

  const items = [
    {
      icon: Globe2,
      title: getContent("about_feat1_title", "ОХУ-ын Үйлдвэрүүдтэй Шууд Гэрээ"),
      desc: getContent("about_feat1_desc", "Алтай хязгаар, Новосибирскийн томоохон элеватор, үйлдвэрүүдтэй зуучлагчгүй шууд нийлүүлэлтийн гэрээтэй.")
    },
    {
      icon: Warehouse,
      title: getContent("about_feat2_title", "Өөрийн Зориулалтын Элеватор & Бааз"),
      desc: getContent("about_feat2_desc", "Толгойт өртөө болон Дархан хотод төмөр замын салаа зам бүхий 40,000 тн үр тариа хадгалах элеватортой.")
    },
    {
      icon: ShieldCheck,
      title: getContent("about_feat3_title", "100% Лабораторийн Баталгаажилт"),
      desc: getContent("about_feat3_desc", "Ачаа бүр дээр SGS болон Улсын Мэргэжлийн Хяналтын итгэмжлэгдсэн сорилтын протокол дагалдана.")
    },
    {
      icon: Layers,
      title: getContent("about_feat4_title", "Гаалийн Ногоон Гарц & Түргэн Бэлтгэл"),
      desc: getContent("about_feat4_desc", "Хил, гааль, ургамал хорио цээрийн бүрдүүлэлтийг мэргэшсэн брокерууд 24 цагийн дотор шийдвэрлэнэ.")
    }
  ];

  return (
    <section id="about" className="scroll-mt-24 py-16 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>{getContent("about_badge", "Бидний тухай")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {getContent("about_title", "Монголын Хүнс, Хөдөө Аж Ахуйн Салбарын Бөөний Түнш")}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {getContent("about_description", "PTS Agro Trade нь гурилын үйлдвэрүүд, эрчимжсэн мал аж ахуй, тэжээлийн үйлдвэрүүдэд ОХУ-ын Алтай, Новосибирскийн элеваторуудаас стандартын шаардлага хангасан үр тариа, уургийн тэжээлийг шууд үйлдвэрийн бөөний үнээр нийлүүлж байна.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sky-400 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
