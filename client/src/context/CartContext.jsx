import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { CartContext } from "./cartContextDefinition";
import { useAuth } from "./useAuth";

import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartService";

export function CartProvider({ children }) {
  const {
    isAuthenticated,
    loading: authLoading,
    user,
  } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    if (
      authLoading ||
      !isAuthenticated ||
      user?.role !== "BUYER"
    ) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getCart();

      setCart(data);
    } catch (err) {
      console.error("Cart request failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your cart."
      );
    } finally {
      setLoading(false);
    }
  }, [
    authLoading,
    isAuthenticated,
    user?.role,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCart();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadCart]);

  const addItem = async (
    productId,
    quantity
  ) => {
    try {
      setError("");

      const data = await addCartItem(
        productId,
        quantity
      );

      setCart(data);

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to add product to cart.";

      setError(message);

      throw err;
    }
  };

  const updateItem = async (
    productId,
    quantity
  ) => {
    try {
      setError("");

      const data = await updateCartItem(
        productId,
        quantity
      );

      setCart(data);

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to update cart item.";

      setError(message);

      throw err;
    }
  };

  const removeItem = async (productId) => {
    try {
      setError("");

      const data =
        await removeCartItem(productId);

      setCart(data);

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to remove cart item.";

      setError(message);

      throw err;
    }
  };

  const clear = async () => {
    try {
      setError("");

      const data = await clearCart();

      setCart(data);

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to clear your cart.";

      setError(message);

      throw err;
    }
  };

  const value = {
    cart,
    loading,
    error,
    loadCart,
    addItem,
    updateItem,
    removeItem,
    clear,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}