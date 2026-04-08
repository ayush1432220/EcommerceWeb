"use client";
export default function ProductCard({ p, onClick, onAdd }){
  const emoji = p.emoji ?? "📦";
  const category = p.cat ?? p.category ?? "Product";
  const brand = p.brand ?? "Store";
  const badge = p.badge ?? (p.isActive ? "new" : "sold out");
  const badgeClass = badge === 'new' ? 'badge-new' : badge === 'sale' ? 'badge-sale' : 'badge-hot';
  const stars = Number.isFinite(p.stars) ? p.stars : 4;

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-img">{emoji}<span className={`product-badge ${badgeClass}`}>{badge}</span></div>
      <div className="product-info">
        <div className="product-cat">{category}</div>
        <div className="product-name">{p.name}</div>
        <div className="product-brand">{brand}</div>
        <div className="product-footer">
          <div>
            <span className="product-price">${p.price}</span>
            {p.oldPrice ? <span className="product-old-price">${p.oldPrice}</span> : null}
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:2}}>
            <div className="stars">{'★'.repeat(p.stars) + '☆'.repeat(5-p.stars)}</div>
            <button className="add-btn" onClick={(e)=>{ e.stopPropagation(); onAdd(p.id); }}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
