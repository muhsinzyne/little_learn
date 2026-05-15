import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/providers/SessionProvider";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | LittleLearn",
    default: "LittleLearn — Fun Learning for Preschoolers",
  },
  description: "A playful, safe, and interactive learning platform designed for children aged 3–6. Learn letters, numbers, shapes, and colors through adventure!",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-nunito antialiased`}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
