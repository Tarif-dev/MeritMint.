import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// New test2 Address - 0xdf568a9864e14d98

export const metadata = {
  title: "MeritMint.",
  description: "Where Achievements Meet Rewards",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
