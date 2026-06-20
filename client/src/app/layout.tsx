import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext';
import "../index.css";

export const metadata: Metadata = {
  title: "CutPro",
  description: "The Elite Grooming Network & Salon SaaS Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-white bg-[#050505]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
