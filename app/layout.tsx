import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "英会話スクール収益シミュレーター",
  description: "SNS規模から英会話スクール事業の黒字化ラインを試算します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
