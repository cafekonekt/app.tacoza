import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { DrawerProvider } from "@/context/DrawerContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Home - tacoza (Instant food Ordering)",
  description: "Crave, Scan and Order superfast",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <DrawerProvider>
        <CartProvider>
          <body className={inter.className}>{children}</body>
        </CartProvider>
      </DrawerProvider>
    </html>
  );
}
