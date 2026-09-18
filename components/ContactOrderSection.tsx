"use client";

import React, { useState } from "react";
import { b2bStore } from "@/lib/store";
import { 
  PhoneCall, 
  MapPin, 
  Building, 
  Mail, 
  CheckCircle2, 
  ExternalLink,
  Send,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";

export default function ContactOrderSection() {
  const { getContent } = useSiteContent();
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    productName: "1-р зэргийн буудай (Алтай)",
    tons: 60,
    destination: "Улаанбаатар, Толгойт өртөө",
    notes: ""
  });

  const [orderResult, setOrderResult] = useState<{
    code: string;
    emails: string[];
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await b2bStore.submitDirectOrder({
        customer_company: form.companyName,
        customer_phone: form.phone,
        customer_contact_person: form.contactPerson,
        product_name: form.productName,
        quantity_tons: Number(form.tons),
        destination: form.destination,
        notes: form.notes
      });

      setOrderResult({
        code: res.order_code,
        emails: res.dispatched_emails
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-semibold mb-2">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{getContent("contact_badge", "Бөөний захиалга & Салбарын хаяг")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {getContent("contact_title", "Бөөний Захиалга Өгөх & Төв Баазын Байршил")}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {getContent("contact_subtitle", "Бөөний нийлүүлэлтийн захиалгын маягтыг бөглөхөд манай худалдааны менежер шуурхай холбогдож, гэрээ болон нийлүүлэлтийг баталгаажуулна.")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Branches, Map Link, Image */}
          <div className="lg:col-span-5 space-y-4">
            {/* Branch Details */}
            <div className="p-5 rounded-xl bg-slate-950/85 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-sky-400" />
                <span>{getContent("contact_branch_title", "Төв Бааз & Байршлын Хаяг")}</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">
                      {getContent("contact_address_label", "Бөөний төв / Баазын хаяг:")}
                    </strong>
                    <span className="text-slate-400">
                      {getContent("contact_address", "Сонгинохайрхан дүүрэг, 20-р хороо, Толгойт өртөө, 3-р салаа зам, PTS Үр тарианы элеватор бааз")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-800">
                  <PhoneCall className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Холбогдох утас:</span>
                    <strong className="text-white">{getContent("contact_phone", "7711-8899")}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Цахим шуудан:</span>
                    <strong className="text-white">{getContent("contact_email", "order@pts-logistics.mn")}</strong>
                  </div>
                </div>

                {/* Social & Messaging: Viber + Facebook */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* Viber Contact */}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-[#7360F2]/20 border border-[#7360F2]/40 flex items-center justify-center text-[#9b8eff] shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.38 3.52C16.92 1.34 13.48 1 10.45 1.17c-4.94.27-8.38 3.73-8.67 8.67-.18 3.03.16 6.47 2.35 8.93.42.47.38.79.2 1.36l-.8 2.51c-.34 1.06.6 2 1.66 1.66l2.51-.8c.57-.18.89-.22 1.36.2 1.6 1.42 3.59 2.06 5.67 2.06 6.35 0 11.5-5.15 11.5-11.5 0-4.08-2.18-7.85-6.85-10.68zm-1.03 13.23c-.35.53-.94.9-1.58 1.01-.52.09-1.3.06-3.08-.7-2.22-.95-3.95-2.69-4.9-4.91-.76-1.78-.79-2.56-.7-3.08.11-.64.48-1.23 1.01-1.58.4-.26.88-.31 1.29-.14.3.13.73.99 1.02 1.67.18.44.2.77.07 1-.1.17-.25.35-.44.58-.16.19-.25.33-.17.52.39.93 1.21 1.84 2.18 2.39.24.14.4.1.57-.07.21-.21.41-.47.6-.64.22-.21.49-.22.84-.09.57.21 1.74.88 1.99 1.14.24.24.22.58-.08 1.1z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-slate-400 text-[10px] block">Viber Шуурхай Чат:</span>
                      <a 
                        href={`viber://chat?number=${getContent("contact_viber", "+97699118421").replace(/[^0-9+]/g, "")}`} 
                        className="text-white font-bold hover:text-sky-400 transition-colors flex items-center gap-1 text-xs truncate"
                      >
                        <span className="truncate">{getContent("contact_viber", "+976 9911-8421")}</span>
                        <span className="text-[10px] text-sky-400 font-normal underline shrink-0">Чатлах</span>
                      </a>
                    </div>
                  </div>

                  {/* Facebook Contact */}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#1877F2]/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#1877F2]/15 border border-[#1877F2]/35 flex items-center justify-center text-[#1877F2] shrink-0">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-slate-400 text-[10px] block">Facebook Хуудас:</span>
                      <a 
                        href={getContent("contact_facebook_url", "https://facebook.com/ptsagrotrade")} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-bold hover:text-[#1877F2] transition-colors flex items-center gap-1 text-xs truncate"
                      >
                        <span className="truncate">{getContent("contact_facebook_handle", "fb.com/ptsagrotrade")}</span>
                        <span className="text-[10px] text-sky-400 font-normal underline shrink-0">Нээх ↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Location Image & Direct Map Link */}
            <div className="rounded-xl bg-slate-950/85 border border-slate-800 overflow-hidden">
              <div className="relative h-48 w-full bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                  alt="PTS Agro Trade Base Location"
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-lg shadow-blue-500/30">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-white bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700 block">
                      {getContent("contact_map_badge", "Төв бааз, Агуулах")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 flex items-center justify-between">
                <span className="text-xs text-slate-400">Google Maps дээр харах:</span>
                <a
                  href={getContent("contact_google_maps_url", "https://maps.google.com/?q=Tolgoit+Station+Ulaanbaatar")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
                >
                  <span>Google Maps нээх</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Direct Order Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-7 rounded-xl bg-slate-950/85 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-1">
                Бөөний Захиалгын Хүсэлт Илгээх
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Захиалгын хүсэлт манай борлуулалтын албанд хүргэгдэж, шалгагдсаны дараа албан ёсны захиалга болж баталгаажна.
              </p>

              {orderResult ? (
                <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                  <CheckCircle2 className="w-10 h-10 text-sky-400 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-white">Захиалгын Хүсэлтийг Амжилттай Хүлээн Авлаа!</h4>
                  <div className="my-3 inline-block bg-slate-900 px-4 py-1.5 rounded-lg font-mono text-xs text-amber-400 border border-slate-800">
                    Хүсэлтийн код: <strong className="text-white text-sm">{orderResult.code}</strong>
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Таны хүсэлтийн мэдээлэл бүртгэгдэж, мэдэгдэл <strong>{orderResult.emails.join(", ")}</strong> имэйл рүү илгээгдлээ. Манай борлуулалтын менежер гэрээ, нийлүүлэлтийн нөхцөлийг тохирч албан ёсоор баталгаажуулахаар холбогдох болно.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOrderResult(null)}
                    className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
                  >
                    Дахин хүсэлт илгээх
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1 text-xs">
                        Байгууллагын нэр:
                      </label>
                      <input
                        type="text"
                        required
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        placeholder="Жишээ: Алтан Тариа ХХК"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1 text-xs">
                        Холбоо барих утас:
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Жишээ: 9911-XXXX"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1 text-xs">
                        Бүтээгдэхүүн:
                      </label>
                      <select
                        value={form.productName}
                        onChange={(e) => setForm({ ...form, productName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="1-р зэргийн буудай (Алтай)">1-р зэргийн буудай (Алтай)</option>
                        <option value="2-р зэргийн буудай (Красноярск)">2-р зэргийн буудай (Красноярск)</option>
                        <option value="Малын хивэг (Ширхэгтэй)">Малын тэжээлийн хивэг</option>
                        <option value="Шар буурцагны шрот (Protein 46%)">Шар буурцагны шрот</option>
                        <option value="Тэжээлийн овъёос">Тэжээлийн овъёос ба арвай</option>
                        <option value="Техникийн рапс">Техникийн рапсын үр</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1 text-xs">
                        Тоо хэмжээ (Тонн):
                      </label>
                      <input
                        type="number"
                        required
                        min="10"
                        value={form.tons}
                        onChange={(e) => setForm({ ...form, tons: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1 text-xs">
                      Хүргэх аймаг, сум / Терминал:
                    </label>
                    <input
                      type="text"
                      required
                      value={form.destination}
                      onChange={(e) => setForm({ ...form, destination: e.target.value })}
                      placeholder="Жишээ: Улаанбаатар, Толгойт өртөө"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1 text-xs">
                      Нэмэлт тэмдэглэл:
                    </label>
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Хүргэлтийн онцлог, шаардлагатай хугацаа гэх мэт..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm shadow-blue-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Бөөний Захиалга Баталгаажуулах</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
