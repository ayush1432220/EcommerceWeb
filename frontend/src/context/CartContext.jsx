"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } from "../lib/api";

const CartContext = createContext(null);

const emptyCart = {
  id: null,
  userId: null,
  items: [],
  itemCount: 0,
  subtotal: 0,
  createdAt: null,
  updatedAt: null
};

const normalizeProduct = (product) => {
  if (!product) {
    return null;
  }

  return {
    id: product.id ?? product._id ?? null,
    name: product.name ?? "Product",
    description: product.description ?? "",
    price: product.price ?? 0,
    oldPrice: product.oldPrice ?? null,
    stock: product.stock ?? 0,
    emoji: product.emoji ?? "📦",
    cat: product.cat ?? product.category ?? "General",
    brand: product.brand ?? "Store",
    stars: product.stars ?? 4,
    badge: product.badge ?? "new",
    isActive: Boolean(product.isActive)
  };
};

const normalizeItem = (item) => {
  const product = normalizeProduct(item.product);
  const productId = item.productId?.id ?? item.productId?._id ?? item.productId ?? product?.id ?? null;

  if (!productId) {
    return null;
  }

  const quantity = Number(item.quantity ?? 0);
  const price = Number(item.price ?? product?.price ?? 0);
  const lineTotal = Number((item.lineTotal ?? price * quantity).toFixed(2));

  return {
    id: item.id ?? item._id ?? productId,
    productId,
    quantity,
    price,
    lineTotal,
    availableStock: item.availableStock ?? product?.stock ?? null,
    product
  };
};

const normalizeCart = (cart) => {
  if (!cart) {
    return emptyCart;
  }

  const items = Array.isArray(cart.items)
    ? cart.items.map(normalizeItem).filter(Boolean)
    : [];

  const itemCount =
    typeof cart.itemCount === "number"
      ? cart.itemCount
      : items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal =
    typeof cart.subtotal === "number"
      ? cart.subtotal
      : Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));

  return {
    id: cart.id ?? cart._id ?? null,
    userId: cart.userId ?? null,
    items,
    itemCount,
    subtotal,
    createdAt: cart.createdAt ?? null,
    updatedAt: cart.updatedAt ?? null
  };
};

export const CartProvider = ({ userId, children }) => {
  const [cart, setCart] = useState(emptyCart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      if (!userId) {
        setCart(emptyCart);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setCart(emptyCart);

      try {
        const payload = await getCart();
        if (!cancelled) {
          setCart(normalizeCart(payload.data?.cart));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setCart(emptyCart);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const hydrateCart = (payload) => {
    const nextCart = normalizeCart(payload?.data?.cart);
    setCart(nextCart);
    setError(null);
    return nextCart;
  };

  const addItem = async ({ productId, quantity = 1 }) => {
    setError(null);
    try {
      const payload = await addCartItem({ productId, quantity });
      return hydrateCart(payload);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateItem = async ({ productId, quantity }) => {
    setError(null);
    try {
      const payload = await updateCartItem({ productId, quantity });
      return hydrateCart(payload);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const removeItem = async (productId) => {
    setError(null);
    try {
      const payload = await removeCartItem(productId);
      return hydrateCart(payload);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const clearItems = async () => {
    setError(null);
    try {
      const payload = await clearCart();
      return hydrateCart(payload);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const refreshCart = async () => {
    setError(null);
    try {
      const payload = await getCart();
      return hydrateCart(payload);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items,
        itemCount: cart.itemCount,
        subtotal: cart.subtotal,
        isLoading,
        error,
        addItem,
        updateItem,
        removeItem,
        clearCart: clearItems,
        refreshCart,
        setCart: (nextCart) => setCart(normalizeCart(nextCart))
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
