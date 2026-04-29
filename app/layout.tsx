import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "SkillBridge | Peer-to-Peer Learning",
  description: "Exchange skills, elevate minds. The premium skill exchange platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#050505] text-white antialiased">
        {children}
      </body>
    </html>
  );
}