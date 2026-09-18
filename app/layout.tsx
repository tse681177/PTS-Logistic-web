import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PTS Agro Trade | Үр Тариа, Тэжээлийн Бөөний Худалдааны Нэгдсэн Платформ",
  description: "ОХУ, Сибирийн шилдэг элеваторуудаас хүнсний улаан буудай, малын тэжээл, хивэг, шротыг их хэмжээгээр шууд нийлүүлэх бөөний худалдааны нэгдсэн B2B платформ.",
};

import { ContentProvider } from "@/context/ContentContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className="scroll-smooth">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
        <ContentProvider>
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}
