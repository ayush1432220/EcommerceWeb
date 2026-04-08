"use client";

export default function Navbar({ page, setPage, badgeCount, user, onCartClick }) {
  return (
    <nav>
      <div className="logo">
        Neu<span>Shop</span>
      </div>
      <div className="nav-search">
        <span className="search-icon">Search</span>
        <input type="text" placeholder="Search products, brands..." />
      </div>
      <div className="nav-links">
        <button className={`nav-btn ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Home</button>
        <button className={`nav-btn ${page === "listing" ? "active" : ""}`} onClick={() => setPage("listing")}>Shop</button>
        <button className={`nav-btn ${page === "detail" ? "active" : ""}`} onClick={() => setPage("detail")}>Product</button>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {user ? <span style={{ fontSize: 13, color: "var(--text-muted)", marginRight: 8 }}>Hi, {user.email}</span> : null}
        <button className="cart-btn" onClick={onCartClick}>
          Cart<span className="cart-badge">{badgeCount}</span>
        </button>
        {!user ? (
          <>
            <button className="nav-btn" onClick={() => setPage("login")}>Login</button>
            <button className="nav-btn" onClick={() => setPage("register")}>Register</button>
          </>
        ) : (
          <button className="nav-btn" onClick={() => setPage("logout")}>Logout</button>
        )}
      </div>
    </nav>
  );
}
