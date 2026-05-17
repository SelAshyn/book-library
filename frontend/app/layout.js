import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Novella",
  description: "Stories That Stay Yours - Your Personal Reading Companion to Organize Books and Build Better Reading Habits",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >


      <body>
        <AuthProvider>
          <div className="fixed top-0 -left-40 w-80 h-80 bg-orange-400 rounded-full blur-3xl opacity-20 animate-blob pointer-events-none translate-z-0" />
          <div className="fixed top-40 -right-40 w-80 h-80 bg-orange-300 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none translate-z-0" />
          <div className="fixed -bottom-8 left-20 w-80 h-80 bg-orange-500 rounded-full blur-3xl opacity-15 animate-blob animation-delay-4000 pointer-events-none translate-z-0" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
