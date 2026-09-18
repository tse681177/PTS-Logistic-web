"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import { X, Image as ImageIcon, FileText, Trash2 } from "lucide-react";

interface ProductModalProps {
  product: Product | null; // null if creating new
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export default function ProductModal({ product, isOpen, onClose, onSuccess }: ProductModalProps) {
  const isEditing = Boolean(product);

  const [title, setTitle] = useState(product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState<"ready" | "preorder">(product?.category || "ready");
  const [pricePerTon, setPricePerTon] = useState<number>(product?.price_per_ton || 950000);
  const [origin, setOrigin] = useState(product?.origin || "Алтай хязгаар, ОХУ");
  const [packaging, setPackaging] = useState(product?.packaging || "Задгай вагон / 50кг шуудай");
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [pdfUrl, setPdfUrl] = useState(product?.lab_cert_pdf_url || "");
  const [certNo, setCertNo] = useState(product?.lab_cert_details?.cert_no || "SGS-MNG-2026-001");
  const [inStockTons, setInStockTons] = useState(product?.in_stock_tons || 100);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setTitle(product.title || "");
        setDescription(product.description || "");
        setCategory(product.category || "ready");
        setPricePerTon(product.price_per_ton || 950000);
        setOrigin(product.origin || "Алтай хязгаар, ОХУ");
        setPackaging(product.packaging || "Задгай вагон / 50кг шуудай");
        setImageUrl(product.image_url || "");
        setPdfUrl(product.lab_cert_pdf_url || "");
        setCertNo(product.lab_cert_details?.cert_no || "SGS-MNG-2026-001");
        setInStockTons(product.in_stock_tons || 100);
      } else {
        setTitle("");
        setDescription("");
        setCategory("ready");
        setPricePerTon(950000);
        setOrigin("Алтай хязгаар, ОХУ");
        setPackaging("Задгай вагон / 50кг шуудай");
        setImageUrl("");
        setPdfUrl("");
        setCertNo("SGS-MNG-2026-001");
        setInStockTons(100);
      }
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // File upload simulation (converts local image to data URL or sets URL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfUrl(`/docs/${file.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productPayload: Omit<Product, "id"> = {
      title,
      description,
      category,
      price_per_ton: Number(pricePerTon),
      currency: "₮",
      origin,
      packaging,
      specs: product?.specs || {
        gluten: "28.0%",
        moisture: "13.5%",
        foreign_matter: "1.5%",
        test_weight: "775 г/л",
        protein: "14.0%"
      },
      image_url: imageUrl || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
      lab_cert_pdf_url: pdfUrl || "/docs/lab-cert-wheat-g1.pdf",
      lab_cert_details: {
        cert_no: certNo || "SGS-2026-01",
        lab_name: "SGS Mongolia & Улсын Чанарын Лаборатори",
        accreditation_no: "MNS ISO/IEC 17025",
        issue_date: new Date().toISOString().substring(0, 10),
        inspector_name: "Д.Ганчимэг (Шинжээч)",
        conclusion: "Стандартын шаардлагыг бүрэн хангасан болохыг батлав.",
        parameters: product?.lab_cert_details?.parameters || [
          { name: "Цавуулаг", standard: "≥ 28.0%", actual: "28.2%", unit: "%", passed: true },
          { name: "Чийглэг", standard: "≤ 14.0%", actual: "13.4%", unit: "%", passed: true },
          { name: "Хольц", standard: "≤ 2.0%", actual: "1.2%", unit: "%", passed: true }
        ]
      },
      in_stock_tons: Number(inStockTons),
      min_order_tons: 20,
      is_active: true
    };

    if (isEditing && product) {
      await b2bStore.saveProduct({ ...productPayload, id: product.id });
      onSuccess(`"${title}" бүтээгдэхүүний мэдээлэл шинэчлэгдлээ.`);
    } else {
      await b2bStore.createProduct(productPayload);
      onSuccess(`"${title}" шинэ бүтээгдэхүүн амжилттай нэмэгдлээ.`);
    }

    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 my-8 cursor-default"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <h3 className="text-base font-bold text-white">
            {isEditing ? "Бүтээгдэхүүний Мэдээлэл Засах" : "Шинэ Бүтээгдэхүүн Нэмэх"}
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
          >
            <X className="w-4 h-4" />
            <span>Хаах (Esc)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Бүтээгдэхүүний нэр:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Жишээ: 1-р зэргийн буудай (Алтай)"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Тайлбар:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Бүтээгдэхүүний онцлог, хэрэглээний зориулалт..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Үнэ / Тонн (₮):</label>
              <input
                type="number"
                required
                value={pricePerTon}
                onChange={(e) => setPricePerTon(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ангилал:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as "ready" | "preorder")}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="ready">Бэлэн бараа (Агуулахад)</option>
                <option value="preorder">Урьдчилсан захиалга (Гэрээгээр)</option>
              </select>
            </div>
          </div>

          {/* IMAGE ATTACHMENT & REMOVE */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Зураг аттач хийх (Image Attachment):</span>
              </span>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Зураг устгах</span>
                </button>
              )}
            </div>

            {imageUrl ? (
              <div className="flex items-center gap-3 mb-2">
                <img src={imageUrl} alt="Preview" className="w-16 h-12 rounded object-cover border border-slate-700" />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Зургийн URL..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-white"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Зургийн шууд URL оруулах..."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">эсвэл файл сонгох:</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-[11px] text-slate-400 file:bg-slate-800 file:text-slate-200 file:border-0 file:rounded file:px-2 file:py-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PDF FILE ATTACHMENT & REMOVE */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Лабораторийн PDF файл аттач хийх:</span>
              </span>
              {pdfUrl && (
                <button
                  type="button"
                  onClick={() => setPdfUrl("")}
                  className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>PDF устгах</span>
                </button>
              )}
            </div>

            {pdfUrl ? (
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-slate-900 px-2.5 py-1 rounded text-[11px] font-mono text-sky-400 border border-slate-800 flex-1 truncate">
                  {pdfUrl}
                </span>
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="PDF файлын хаяг (жишээ: /docs/lab-cert-wheat-g1.pdf)..."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">эсвэл PDF сонгох:</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="text-[11px] text-slate-400 file:bg-slate-800 file:text-slate-200 file:border-0 file:rounded file:px-2 file:py-1"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Гэрчилгээний дугаар:</label>
              <input
                type="text"
                value={certNo}
                onChange={(e) => setCertNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Агуулахын үлдэгдэл (тн):</label>
              <input
                type="number"
                value={inStockTons}
                onChange={(e) => setInStockTons(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Болих
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
            >
              {isEditing ? "Шинэчлэх" : "Нэмэх"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
