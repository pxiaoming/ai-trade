import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "中国股市AI助手",
  description: "实时股票涨跌幅排行榜、AI问答对话和股票分析",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
