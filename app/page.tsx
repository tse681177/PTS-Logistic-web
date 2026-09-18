"use client";

import React from "react";
import MarqueeTicker from "@/components/MarqueeTicker";
import StickyNavbar from "@/components/StickyNavbar";
import HeroSection from "@/components/HeroSection";
import PublicOrdersBoard from "@/components/PublicOrdersBoard";
import ProductsSection from "@/components/ProductsSection";
import LogisticsRouteSection from "@/components/LogisticsRouteSection";
import AboutSection from "@/components/AboutSection";
import ContactOrderSection from "@/components/ContactOrderSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. Live Continuous Marquee Ticker (Minimal, no % change) */}
      <MarqueeTicker />

      {/* 2. Sticky Navbar with backdrop-blur and smooth scrolling */}
      <StickyNavbar />

      <main className="flex-1">
        {/* Minimal Hero Section */}
        <HeroSection />

        {/* 3. Section #public-orders (Тээврийн явцын ил тод самбар) */}
        <PublicOrdersBoard />

        {/* 4. Section #products (Бүтээгдэхүүний жагсаалт & Шинжилгээ) */}
        <ProductsSection />

        {/* 5. Section #logistics (Тээврийн 2 маршрут: Route A & B) */}
        <LogisticsRouteSection />

        {/* 6. Section #about (Бидний тухай & Давуу тал) */}
        <AboutSection />

        {/* 7. Section #contact (Шууд захиалга өгөх & Салбарын хаяг, Google Maps) */}
        <ContactOrderSection />
      </main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}
