import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "StyleOS 造型工作台",
  description: "面向发型与造型创作者的邀请制 Alpha 咨询工作台。"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className="bg-app">
      <body>{children}</body>
    </html>
  );
}
