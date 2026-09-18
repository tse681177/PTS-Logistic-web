"use client";

import React, { useState, useEffect } from "react";
import { SiteContent, ContentSection } from "@/lib/types";
import { useSiteContent } from "@/context/ContentContext";
import { 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Building2, 
  Truck, 
  Train,
  PhoneCall, 
  Sliders, 
  Layers
} from "lucide-react";

interface AdminContentTabProps {
  onNotification: (msg: string) => void;
}

const SECTION_CONFIG: {
  key: ContentSection;
  label: string;
  icon: any;
  desc: string;
}[] = [
  {
    key: "HERO",
    label: "Hero & Уриа үг",
    icon: Sparkles,
    desc: "Сайтын нүүрэн талын толгой гарчиг, уриа, товчны бичвэр, тоон статистик үзүүлэлтүүд",
  },
  {
    key: "ABOUT",
    label: "Бидний тухай & Давуу тал",
    icon: Building2,
    desc: "Компанийн үндсэн танилцуулга бичвэр болон 4 гол давуу талын гарчиг, дэлгэрэнгүй тайлбар",
  },
  {
    key: "LOGISTICS",
    label: "Хүргэлтийн нөхцөл",
    icon: Truck,
    desc: "Бөөний нийлүүлэлтийн хүргэлтийн 2 хэлбэр (Авто тээвэр ба Төмөр замын вагон нийлүүлэлт)-ийн тайлбар",
  },
  {
    key: "CONTACT",
    label: "Холбоо барих & Хаяг",
    icon: PhoneCall,
    desc: "Үндсэн утас, Viber, Facebook хуудасны богино линк, цахим шуудан, төв баазын хаяг, ажиллах цаг, Google Maps",
  },
  {
    key: "COMMON",
    label: "Брэнд & Хөл хэсэг",
    icon: Sliders,
    desc: "Сайтын брэндийн нэр, дэд тайлбар, хөл хэсгийн (Footer) танилцуулга болон зохиогчийн эрх",
  },
];

export default function AdminContentTab({ onNotification }: AdminContentTabProps) {
  const { allContents, saveBulkContents, resetDefaults } = useSiteContent();
  const [activeSection, setActiveSection] = useState<ContentSection>("HERO");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const map: Record<string, string> = {};
    allContents.forEach((c) => {
      map[c.key] = c.value;
    });
    setFormData(map);
  }, [allContents]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSection = async (section: ContentSection) => {
    setIsSaving(true);
    const sectionItems = allContents.filter((c) => c.section === section);
    const updates = sectionItems.map((item) => ({
      key: item.key,
      value: formData[item.key] !== undefined ? formData[item.key] : item.value,
    }));

    try {
      await saveBulkContents(updates);
      setHasChanges(false);
      onNotification(`"${SECTION_CONFIG.find((s) => s.key === section)?.label}" хэсгийн бичвэрүүд амжилттай хадгалагдлаа!`);
    } catch (err) {
      console.error(err);
      onNotification("Алдаа гарлаа, дахин оролдоно уу.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const updates = Object.keys(formData).map((key) => ({
      key,
      value: formData[key],
    }));

    try {
      await saveBulkContents(updates);
      setHasChanges(false);
      onNotification("Сайтын бүх бичвэр амжилттай хадгалагдаж, нүүр хуудас дээр шинэчлэгдлээ!");
    } catch (err) {
      console.error(err);
      onNotification("Хадгалахад алдаа гарлаа.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Бүх бичвэрийг анхны анхдагч найруулга руу буцаахдаа итгэлтэй байна уу?")) {
      await resetDefaults();
      setHasChanges(false);
      onNotification("Бүх бичвэрийг анхны найруулгаар амжилттай сэргээлээ.");
    }
  };

  const currentSectionItems = allContents.filter((c) => c.section === activeSection);

  return (
    <div className="space-y-6">
      {/* Top Banner & Global Action Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <span>Вебийн Бичвэр & Агуулга Засах (CMS)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Нүүр хуудасны бүх гарчиг, уриа үг, танилцуулга, хүргэлтийн нөхцөл, хаяг мэдээллийг код руу оролгүйгээр эндээс шууд засаж хадгална.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Анхны утгаар сэргээх</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-900/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Хадгалж байна..." : "Бүгдийг Хадгалах"}</span>
          </button>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {SECTION_CONFIG.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.key;
          const count = allContents.filter((c) => c.section === sec.key).length;
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSection(sec.key)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? "bg-blue-600/15 border-blue-500 text-white shadow-sm shadow-blue-500/10"
                  : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                  {count} бичвэр
                </span>
              </div>
              <div className="font-bold text-xs truncate">{sec.label}</div>
            </button>
          );
        })}
      </div>

      {/* Current Section Editor Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{SECTION_CONFIG.find((s) => s.key === activeSection)?.label}</span>
              <span className="text-xs font-mono font-normal text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                {activeSection}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {SECTION_CONFIG.find((s) => s.key === activeSection)?.desc}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSection(activeSection)}
            disabled={isSaving}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-900/30 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Энэ хэсгийг хадгалах</span>
          </button>
        </div>

        {/* Fields List */}
        <div className="space-y-4">
          {currentSectionItems.map((item) => {
            const val = formData[item.key] !== undefined ? formData[item.key] : item.value;
            const isTextarea = item.field_type === "textarea";

            return (
              <React.Fragment key={item.key}>
                {item.key === "hero_stat1_value" && (
                  <div className="pt-6 pb-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sky-400 font-bold text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Нүүр хуудасны 4 статистик үзүүлэлт (Нүүрний баннерын доод эгнээ)</span>
                    </div>
                    <span className="text-[11px] font-normal text-slate-400">
                      Толгойт & Дархан, элеватор бааз зэрэг 4 үзүүлэлтийн гарчиг, утгыг эндээс засна
                    </span>
                  </div>
                )}
                {item.key === "hero_stat4_value" && (
                  <div className="pt-4 pb-1 border-t border-slate-800/60 flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                    <span>4-р үзүүлэлт: Элеватор баазын тохиргоо ("Толгойт & Дархан" / "Өөрийн элеватор бааз")</span>
                  </div>
                )}
                {item.key === "logistics_route_a_badge" && (
                  <div className="pt-4 pb-1 border-t border-slate-800 flex items-center gap-2 text-sky-400 font-bold text-xs">
                    <Truck className="w-4 h-4" />
                    <span>Хэлбэр А (Авто замын тээвэр)-ийн картын тохиргоо</span>
                  </div>
                )}
                {item.key === "logistics_route_b_badge" && (
                  <div className="pt-4 pb-1 border-t border-slate-800 flex items-center gap-2 text-blue-400 font-bold text-xs">
                    <Train className="w-4 h-4" />
                    <span>Хэлбэр Б (Төмөр замын тээвэр)-ийн картын тохиргоо</span>
                  </div>
                )}
                {item.key === "contact_facebook_url" && (
                  <div className="pt-4 pb-1 border-t border-slate-800 flex items-center justify-between gap-1 text-[#1877F2] font-bold text-xs">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>Facebook Хуудасны Тохиргоо (Хамгийн дээд ба доод хэсэгт байрших)</span>
                    </div>
                    <span className="text-[11px] font-normal text-slate-400">
                      Линк болон богино нэрийг эндээс засна
                    </span>
                  </div>
                )}

                <div
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
                >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-200 block">
                    {item.label || item.key}
                  </label>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    key: {item.key}
                  </span>
                </div>

                {isTextarea ? (
                  <textarea
                    rows={3}
                    value={val}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all leading-relaxed"
                  />
                ) : (
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                )}
              </div>
            </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Section Save Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={() => handleSaveSection(activeSection)}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-900/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Энэ хэсгийг хадгалах</span>
          </button>
        </div>
      </div>
    </div>
  );
}
