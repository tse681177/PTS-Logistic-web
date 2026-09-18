"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { b2bStore } from "@/lib/store";
import { SystemSettings } from "@/lib/types";
import { useSiteContent } from "@/context/ContentContext";
import { 
  Table, 
  Package, 
  Compass, 
  Building2, 
  PhoneCall, 
  ShieldCheck, 
  Menu, 
  X,
  Truck
} from "lucide-react";

export default function StickyNavbar() {
  const { getContent } = useSiteContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>(b2bStore.getSettings());

  useEffect(() => {
    b2bStore.initializeIfEmpty();
    const loadSettings = () => {
      setSettings(b2bStore.getSettings());
    };
    loadSettings();
    const unsub = b2bStore.subscribe(loadSettings);
    return () => unsub();
  }, []);

  const navLinks = [
    { href: "#products", label: "Бүтээгдэхүүн & Үнэ", icon: Package },
    { href: "#public-orders", label: "Нийлүүлэлтийн явц", icon: Table },
    { href: "#logistics", label: "Хүргэлтийн нөхцөл", icon: Compass },
    { href: "#about", label: "Бидний тухай", icon: Building2 },
    { href: "#contact", label: "Бөөний захиалга & Хаяг", icon: PhoneCall },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-9 w-auto object-contain" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20">
                <Package className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="font-bold text-base tracking-tight text-white">
                {getContent("site_brand_name", settings.brand_name || "PTS AGRO TRADE")}
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                {getContent("site_brand_subtitle", "Үр тариа, тэжээлийн бөөний худалдаа")}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Facebook Short Link */}
            <a
              href={getContent("contact_facebook_url", "https://facebook.com/ptsagrotrade")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-[#1877F2]/15 hover:border-[#1877F2]/50 text-slate-200 hover:text-white text-xs font-semibold border border-slate-800 transition-all group"
              title="Facebook хуудас руу зочлох"
            >
              <span className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center text-white shrink-0">
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </span>
              <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                {getContent("contact_facebook_handle", "fb.com/ptsagrotrade")}
              </span>
            </a>

            <a
              href={`tel:${getContent("contact_phone", "7711-8899")}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
              <span>{getContent("contact_phone", "7711-8899")}</span>
            </a>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm shadow-blue-500/20"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Админ</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={getContent("contact_facebook_url", "https://facebook.com/ptsagrotrade")}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
              title="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            <Link
              href="/admin"
              className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-medium"
            >
              Админ
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Цэс"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-3 py-2 rounded text-xs font-medium text-slate-300 hover:bg-slate-900 flex items-center gap-2"
              >
                <Icon className="w-4 h-4 text-sky-400" />
                {link.label}
              </a>
            );
          })}

          <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between px-1">
            <a
              href={getContent("contact_facebook_url", "https://facebook.com/ptsagrotrade")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white py-1"
            >
              <svg className="w-3.5 h-3.5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>{getContent("contact_facebook_handle", "fb.com/ptsagrotrade")}</span>
            </a>

            <a
              href={`tel:${getContent("contact_phone", "7711-8899")}`}
              className="inline-flex items-center gap-1 text-xs text-sky-400 py-1 font-semibold"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{getContent("contact_phone", "7711-8899")}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
