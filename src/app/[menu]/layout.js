import { CartProvider } from "@/context/CartContext";
import { DrawerProvider } from "@/context/DrawerContext";

export default function RootLayout({ children }) {
  return (
    <CartProvider>
      <DrawerProvider>{children}</DrawerProvider>
    </CartProvider>
  );
}
