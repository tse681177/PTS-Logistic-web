"use client";

import React, { useEffect } from "react";
import { Product } from "@/lib/types";
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck, 
  Award, 
  UserCheck 
} from "lucide-react";

interface LabCertificateModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function LabCertificateModal({ product, onClose }: LabCertificateModalProps) {
  // 1. Keyboard ESC key exit handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const cert = product.lab_cert_details;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSimulation = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        `========================================================\n` +
        `УЛСЫН ИТГЭМЖЛЭГДСЭН ЛАБОРАТОРИЙН СОРИЛТЫН ГЭРЧИЛГЭЭ\n` +
        `========================================================\n\n` +
        `Гэрчилгээний дугаар: ${cert.cert_no}\n` +
        `Лаборатори: ${cert.lab_name}\n` +
        `Итгэмжлэлийн дугаар: ${cert.accreditation_no}\n` +
        `Олгосон огноо: ${cert.issue_date}\n` +
        `Шинжээч: ${cert.inspector_name}\n\n` +
        `Бүтээгдэхүүн: ${product.title}\n` +
        `Гарал үүсэл: ${product.origin}\n` +
        `Савлалт: ${product.packaging}\n\n` +
        `СОРИЛТЫН ҮЗҮҮЛЭЛТҮҮД:\n` +
        cert.parameters
          .map(
            (p) =>
              `- ${p.name}: Стандарт ${p.standard} | Бодит үр дүн: ${p.actual} (${p.unit}) -> ТЭНЦСЭН`
          )
          .join("\n") +
        `\n\nДҮГНЭЛТ:\n${cert.conclusion}\n\n` +
        `БАТАЛГААЖУУЛСАН ТАМГА, ШИНЖЭЭЧИЙН ГАРЫН ҮСЭГ БҮХИЙ АЛБАН БАРИМТ БОЛНО.`
      ],
      { type: "text/plain;charset=utf-8" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${product.title.replace(/\s+/g, "_")}_Lab_Certificate_${cert.cert_no}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    /* Backdrop click closes modal */
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto cursor-pointer"
    >
      {/* Modal Container: stopPropagation prevents backdrop click from firing when clicking inside modal */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden my-8 cursor-default"
      >
        {/* Modal Top Bar */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs sm:text-sm">
            <FileCheck className="w-4 h-4" />
            <span>Лабораторийн Албан Ёсны Сорилтын Гэрчилгээ</span>
          </div>

          {/* Prominent Close button with ESC indicator */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-semibold border border-slate-700 hover:border-slate-600 shadow-sm"
            title="Цонхыг хаах (Esc)"
          >
            <X className="w-4 h-4" />
            <span>Гарах (Esc)</span>
          </button>
        </div>

        {/* Modal Body / Certificate Document */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-slate-200">
          {/* Certificate Sheet Border Container */}
          <div className="bg-slate-950/90 rounded-xl p-6 border border-slate-800 shadow-inner">
            {/* Certificate Header */}
            <div className="text-center pb-6 border-b border-slate-800">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 text-sky-400 mb-3">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-wide">
                Чанарын Баталгаажуулалтын Гэрчилгээ
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {cert.lab_name}
              </p>
              <div className="mt-2 inline-flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                <span>Итгэмжлэл: <strong className="text-slate-200">{cert.accreditation_no}</strong></span>
                <span>•</span>
                <span>Дугаар: <strong className="text-sky-400">{cert.cert_no}</strong></span>
                <span>•</span>
                <span>Огноо: <strong className="text-slate-200">{cert.issue_date}</strong></span>
              </div>
            </div>

            {/* Product Meta Info */}
            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-b border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">Бүтээгдэхүүний нэршил:</span>
                <strong className="text-white text-sm">{product.title}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Гарал үүслийн улс / Бүс:</span>
                <strong className="text-white">{product.origin}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Савлагаа & Тээвэрлэлт:</span>
                <strong className="text-white">{product.packaging}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Хяналтын шинжээч:</span>
                <strong className="text-white">{cert.inspector_name}</strong>
              </div>
            </div>

            {/* Parameters Table */}
            <div className="py-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Физик-Химийн болон Чанарын Үзүүлэлтүүд:
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Үзүүлэлтийн нэр</th>
                      <th className="py-2 px-3">Стандарт шаардлага</th>
                      <th className="py-2 px-3">Бодит үр дүн</th>
                      <th className="py-2 px-3 text-right">Үнэлгээ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {cert.parameters.map((param, i) => (
                      <tr key={i} className="hover:bg-slate-900/40">
                        <td className="py-2 px-3 font-sans text-slate-200">
                          {param.name}
                        </td>
                        <td className="py-2 px-3 text-slate-400">
                          {param.standard}
                        </td>
                        <td className="py-2 px-3 text-sky-400 font-bold">
                          {param.actual}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-sans">
                            <CheckCircle2 className="w-3 h-3" /> Тэнцсэн
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Final Conclusion */}
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-sky-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Мэргэжлийн лабораторийн нэгдсэн дүгнэлт:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {cert.conclusion}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-950 px-5 py-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            * Гарын үсэг, албан тамгаар баталгаажсан сорилтын баримт бичиг болно.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Хэвлэх</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadSimulation}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Татах (PDF)</span>
            </button>
            {/* Explicit Close Button in Footer */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/30 hover:text-rose-300 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Хаах</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
