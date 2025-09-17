import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DaylyLog - 매일의 기록이 만드는 특별한 변화",
  description:
    "일상을 기록하고, 목표를 달성하며, 성장을 추적하는 스마트한 방법",
  keywords: "가계부, 목표달성, 일상기록, 성찰, 자기계발",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#14b8a6" />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            {/* // TODO: Footer 추가 */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
