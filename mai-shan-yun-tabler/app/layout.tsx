import type { Metadata } from "next";
import { Jost, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TicketProvider } from "@/context/ticketContext";

const geistSans = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mai Shan Yun Tabler",
  description: "A beautiful restaurant management app for Mai Shan Yun.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Primary favicon (uploaded) and SVG fallback */}
        <link rel="icon" href="/favicon (2).ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap everything in TicketProvider */}
        <TicketProvider>{children}</TicketProvider>
      </body>
    </html>
  );
}