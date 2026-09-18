import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, PhoneCall, Mail, MapPin, ArrowUp } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";

export default function Footer() {
  const { getContent } = useSiteContent();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                {getContent("site_brand_name", "PTS AGRO TRADE")}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {getContent("footer_description", "ОХУ, Сибирээс их хэмжээний үр тариа, малын тэжээлийг Монголын гурил, тэжээлийн үйлдвэр, фермүүдэд найдвартай нийлүүлэгч B2B бөөний худалдааны платформ.")}
            </p>
            <div className="flex items-center gap-1.5 text-sky-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>SGS & МХЕГ Баталгаажсан Чанар</span>
            </div>
          </div>

          {/* Quick Smooth Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Шуурхай Цэс</h4>
            <ul className="space-y-2">
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  Бүтээгдэхүүн & Үнэ
                </a>
              </li>
              <li>
                <a href="#public-orders" className="hover:text-white transition-colors">
                  Нийлүүлэлтийн явц (Самбар)
                </a>
              </li>
              <li>
                <a href="#logistics" className="hover:text-white transition-colors">
                  Хүргэлтийн нөхцөл
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Бидний тухай & Давуу тал
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Бөөний захиалга & Салбарын хаяг
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Banking */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Холбоо Барих</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-slate-200">{getContent("contact_phone", "7711-8899")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-slate-200">{getContent("contact_email", "order@pts-logistics.mn")}</span>
              </div>
              <a
                href={`viber://chat?number=${getContent("contact_viber", "+97699118421").replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-2 text-slate-200 hover:text-sky-400 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-[#7360F2]/20 border border-[#7360F2]/40 flex items-center justify-center text-[#9b8eff] shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.38 3.52C16.92 1.34 13.48 1 10.45 1.17c-4.94.27-8.38 3.73-8.67 8.67-.18 3.03.16 6.47 2.35 8.93.42.47.38.79.2 1.36l-.8 2.51c-.34 1.06.6 2 1.66 1.66l2.51-.8c.57-.18.89-.22 1.36.2 1.6 1.42 3.59 2.06 5.67 2.06 6.35 0 11.5-5.15 11.5-11.5 0-4.08-2.18-7.85-6.85-10.68zm-1.03 13.23c-.35.53-.94.9-1.58 1.01-.52.09-1.3.06-3.08-.7-2.22-.95-3.95-2.69-4.9-4.91-.76-1.78-.79-2.56-.7-3.08.11-.64.48-1.23 1.01-1.58.4-.26.88-.31 1.29-.14.3.13.73.99 1.02 1.67.18.44.2.77.07 1-.1.17-.25.35-.44.58-.16.19-.25.33-.17.52.39.93 1.21 1.84 2.18 2.39.24.14.4.1.57-.07.21-.21.41-.47.6-.64.22-.21.49-.22.84-.09.57.21 1.74.88 1.99 1.14.24.24.22.58-.08 1.1z"/>
                  </svg>
                </span>
                <span>Viber: {getContent("contact_viber", "+976 9911-8421")}</span>
              </a>

              <a
                href={getContent("contact_facebook_url", "https://facebook.com/ptsagrotrade")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors group"
              >
                <span className="w-5 h-5 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#1877F2] shrink-0 group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </span>
                <span>Facebook: {getContent("contact_facebook_handle", "fb.com/ptsagrotrade")}</span>
              </a>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{getContent("contact_address", "Улаанбаатар, СХД, 20-р хороо, Толгойт өртөө, PTS Бааз")}</span>
              </div>
            </div>
          </div>

          {/* Admin Portal & Security */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Системийн Эрх</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Борлуулалтын менежер, ачилтын хуваарь болон шинэ захиалгын бүртгэлийг админ системээр удирдана.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Админ портал руу нэвтрэх</span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>{getContent("footer_copyright", "© 2026 PTS Agro Trade (ПромТрейдСервис ХХК). Бүх эрх хуулиар хамгаалагдсан.")}</p>
          <div className="flex items-center gap-6">
            <span>Нууцлалын бодлого (ISO 27001)</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>Дээш очих</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
