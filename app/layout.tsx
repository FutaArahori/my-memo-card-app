import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React製 ドラッグ&ドロップメモアプリ",
  description: "自由に追加・編集・移動・分類・整理ができるデジタル付箋（メモ）アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
