"use client";

import { useEffect, useState } from "react";

import { CartProvider, useCart } from "../context/CartContext";
import Footer from "../components/FooterNeo";
import Navbar from "../components/Navbar";
import HomeSection from "../components/HomeSection";
import Listing from "../components/Listing";
import Detail from "../components/Detail";
import CartPanel from "../components/CartPanel";
import Toast from "../components/Toast";
import Login from "../components/Login";
import Register from "../components/Register";
import Logout from "../components/Logout";
import { clearSession, fetchProducts } from "../lib/api";
import { readStoredSession } from "../lib/session";

export default function Home() {
  const [page, setPage] = useState("home");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ show: false, icon: "OK", msg: "" });
  const [user, setUser] = useState(() => readStoredSession().user ?? null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("[Page] Loading products...");
        const serverProducts = await fetchProducts();
        console.log("[Page] Products loaded:", serverProducts.length);
        setProducts(serverProducts);
        setSelectedProduct((current) => current ?? serverProducts[0] ?? null);
      } catch (error) {
        console.error("[Page] Failed to load products:", error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timerId = setTimeout(() => setToast((current) => ({ ...current, show: false })), 2800);
      return () => clearTimeout(timerId);
    }

    return undefined;
  }, [toast.show]);

  const showToast = (icon, msg) => {
    setToast({ show: true, icon, msg });
  };

  return (
    <CartProvider userId={user?.id ?? user?._id ?? null}>
      <HomeView
        page={page}
        setPage={setPage}
        products={products}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        qty={qty}
        setQty={setQty}
        user={user}
        setUser={setUser}
        showToast={showToast}
      />
      <Toast toast={toast} />
      <Footer />
    </CartProvider>
  );
}

function HomeView({
  page,
  setPage,
  products,
  selectedProduct,
  setSelectedProduct,
  qty,
  setQty,
  user,
  setUser,
  showToast
}) {
  const { items, itemCount, subtotal, isLoading: cartLoading, error: cartError, addItem, updateItem, removeItem, clearCart } =
    useCart();

  const handleSessionError = (error) => {
    if (error?.status === 401) {
      clearSession();
      setUser(null);
      setPage("login");
      showToast("LOCK", "Session expired. Please log in again.");
      return true;
    }

    return false;
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setPage("detail");
  };

  const handleAddToCart = async (productId, count = 1) => {
    if (!user) {
      showToast("LOCK", "Please login to add items");
      setPage("login");
      return;
    }

    const product = products.find((item) => item.id === productId);

    try {
      await addItem({ productId, quantity: count });
      showToast("OK", `Added ${product?.emoji || "product"} ${product?.name || ""}`.trim());
    } catch (error) {
      if (!handleSessionError(error)) {
        showToast("!", error.message || "Unable to add item");
      }
    }
  };

  const handleAddToCartFromDetail = async () => {
    if (selectedProduct?.id) {
      await handleAddToCart(selectedProduct.id, qty);
      setQty(1);
    }
  };

  const handleUpdateCartQty = async (productId, delta) => {
    const currentItem = items.find((item) => item.productId === productId);
    if (!currentItem) {
      return;
    }

    const nextQty = currentItem.quantity + delta;
    if (nextQty <= 0) {
      await handleRemoveFromCart(productId);
      return;
    }

    try {
      await updateItem({ productId, quantity: nextQty });
    } catch (error) {
      if (!handleSessionError(error)) {
        showToast("!", error.message || "Unable to update cart");
      }
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeItem(productId);
      showToast("OK", "Item removed from cart");
    } catch (error) {
      if (!handleSessionError(error)) {
        showToast("!", error.message || "Unable to remove item");
      }
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      showToast("OK", "Cart cleared");
    } catch (error) {
      if (!handleSessionError(error)) {
        showToast("!", error.message || "Unable to clear cart");
      }
    }
  };

  const handleCartClick = () => {
    if (!user) {
      showToast("LOCK", "Please login to view your cart");
      setPage("login");
      return;
    }

    setPage("cart");
  };

  const handleCheckout = () => {
    showToast("OK", "Checkout is not wired yet");
  };

  return (
    <>
      <Navbar page={page} setPage={setPage} badgeCount={itemCount} user={user} onCartClick={handleCartClick} />

      <main>
        <HomeSection products={products} setPage={setPage} addToCart={handleAddToCart} onSelect={handleSelectProduct} active={page === "home"} />
        <Listing products={products} setPage={setPage} addToCart={handleAddToCart} onSelect={handleSelectProduct} active={page === "listing"} />
        <Detail
          product={selectedProduct}
          qty={qty}
          changeQty={(delta) => setQty((current) => Math.max(1, Math.min(10, current + delta)))}
          addToCartFromDetail={handleAddToCartFromDetail}
          showToast={showToast}
          active={page === "detail"}
          setPage={setPage}
        />
        <CartPanel
          items={items}
          isLoading={cartLoading}
          isAuthenticated={Boolean(user)}
          cartError={cartError}
          subtotal={subtotal}
          setPage={setPage}
          showToast={showToast}
          onUpdateQty={handleUpdateCartQty}
          onRemove={handleRemoveFromCart}
          onClear={handleClearCart}
          onCheckout={handleCheckout}
          active={page === "cart"}
        />
        <Login setUser={setUser} setPage={setPage} showToast={showToast} active={page === "login"} />
        <Register setUser={setUser} setPage={setPage} showToast={showToast} active={page === "register"} />
        <Logout setUser={setUser} setPage={setPage} showToast={showToast} active={page === "logout"} />
      </main>
    </>
  );
}
