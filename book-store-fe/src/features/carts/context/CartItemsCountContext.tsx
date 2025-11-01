// CartItemsCountContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { cartService } from "../services/cartService";

interface CartItemsCountContextType {
  cartItemsCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  setCartItemsCount: React.Dispatch<React.SetStateAction<number>>;
}

const CartItemsCountContext = createContext<CartItemsCountContextType | null>(null);

export const CartItemsCountProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCartItemsCount = async () => {
    setLoading(true);
    const response = await cartService.getItemsCount();
    if (response.success) {
      setCartItemsCount(response.data ?? 0);
    } else {
      setCartItemsCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCartItemsCount();
  }, []);

  return (
    <CartItemsCountContext.Provider
      value={{ cartItemsCount, loading, refresh: fetchCartItemsCount, setCartItemsCount }}
    >
      {children}
    </CartItemsCountContext.Provider>
  );
};

export const useCartItemsCount = () => {
  const ctx = useContext(CartItemsCountContext);
  if (!ctx) {
    throw new Error("useCartItemsCount must be used inside CartItemsCountProvider");
  }
  return ctx;
};
