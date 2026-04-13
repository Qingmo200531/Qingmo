import type { Metadata } from "next";
import "./globals.css";

import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "清沫证券交易所",
  description: "专业的模拟证券交易平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <body className="flex min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-white tracking-tight">清沫证券交易所</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                市场状态: <span className="text-green-400 font-medium">交易中</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <span className="text-xs font-medium text-slate-300">P</span>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto bg-slate-950/50">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
