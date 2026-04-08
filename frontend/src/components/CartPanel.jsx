"use client";

export default function CartPanel({
  items,
  isLoading,
  isAuthenticated,
  cartError,
  subtotal,
  setPage,
  showToast,
  onUpdateQty,
  onRemove,
  onClear,
  onCheckout,
  active
}) {
  return (
    <section className={`page ${active ? "active" : ""}`} id="page-cart">
      <div style={{ marginBottom: 24 }}>
        <div className="accent-line"></div>
        <h2 className="section-title">Shopping Cart</h2>
      </div>

      <div className="cart-layout">
        <div>
          {cartError && isAuthenticated ? (
            <div className="empty-cart" style={{ marginBottom: 16 }}>
              <h3 className="empty-title">Cart sync failed</h3>
              <p className="empty-desc">{cartError.message || "We could not load your cart right now."}</p>
            </div>
          ) : null}

          <div className="cart-items" id="cartItems">
            {!isAuthenticated ? (
              <div className="empty-cart">
                <div className="empty-icon">LOCK</div>
                <h3 className="empty-title">Sign in to view your cart</h3>
                <p className="empty-desc">Your cart is tied to your account and follows you across sessions.</p>
                <button className="btn btn-primary" onClick={() => setPage("login")}>Log In</button>
              </div>
            ) : isLoading ? (
              <div className="empty-cart">
                <div className="empty-icon">...</div>
                <h3 className="empty-title">Loading cart</h3>
                <p className="empty-desc">Fetching your saved items from the backend.</p>
              </div>
            ) : items.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">CART</div>
                <h3 className="empty-title">Your cart is empty</h3>
                <p className="empty-desc">Discover products you&apos;ll love</p>
                <button className="btn btn-primary" onClick={() => setPage("listing")}>Start Shopping</button>
              </div>
            ) : (
              items.map((item) => {
                const product = item.product || {};

                return (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-img">{product.emoji || "BOX"}</div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{product.name || "Product"}</div>
                      <div className="cart-item-var">{product.cat || "General"} · In Cart</div>
                    </div>
                    <div className="cart-item-right">
                      <div className="cart-price">${item.lineTotal.toFixed(2)}</div>
                      <div className="cart-qty">
                        <button className="cart-qty-btn" onClick={() => onUpdateQty(item.productId, -1)}>−</button>
                        <div className="cart-qty-num">{item.quantity}</div>
                        <button className="cart-qty-btn" onClick={() => onUpdateQty(item.productId, 1)}>+</button>
                      </div>
                      <button className="remove-btn" onClick={() => onRemove(item.productId)}>Remove</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="checkout-card">
          <h3 className="checkout-title">Order Summary</h3>
          <div className="promo-input">
            <input type="text" className="promo-field" placeholder="Promo code" />
            <button className="promo-apply" onClick={() => showToast("OK", "Promo applied! 10% off")}>Apply</button>
          </div>
          <div className="checkout-rows" id="checkoutRows">
            <div className="checkout-row">
              <span>Subtotal</span>
              <span id="subtotal">${subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout-row">
              <span>Shipping</span>
              <span style={{ color: "var(--accent)" }}>Free</span>
            </div>
            <div className="checkout-row">
              <span>Tax (8%)</span>
              <span id="tax">${(subtotal * 0.08).toFixed(2)}</span>
            </div>
            <div className="divider"></div>
            <div className="checkout-row total">
              <span>Total</span>
              <span id="total">${(subtotal * 1.08).toFixed(2)}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
            <button
              className="btn btn-primary"
              style={{ width: "100%", fontSize: 15, padding: 14 }}
              onClick={onCheckout}
              disabled={!isAuthenticated || items.length === 0}
            >
              Checkout -&gt;
            </button>
            {isAuthenticated && items.length > 0 ? (
              <button className="btn btn-ghost" style={{ width: "100%" }} onClick={onClear}>
                Clear Cart
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
