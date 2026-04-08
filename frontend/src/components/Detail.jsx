"use client";
export default function Detail({ product, qty, changeQty, addToCartFromDetail, showToast, active, setPage }){
  const item = product ?? {
    emoji: '📦',
    name: 'Featured Product',
    cat: 'Featured',
    brand: 'Store',
    price: 0,
    oldPrice: null,
    stars: 4,
    badge: 'hot',
    description: 'Browse products from our backend catalog.',
    stock: 0
  };

  return (
    <section className={`page ${active? 'active' : ''}`} id="page-detail">
      <button className="btn btn-ghost" style={{padding:'8px 16px',fontSize:13,marginBottom:24}} onClick={()=>setPage('listing')}>← Back to Shop</button>
      <div className="detail-layout">
        <div>
          <div className="product-gallery" id="detailEmoji">{item.emoji}</div>
          <div className="product-thumbs">
            <div className="thumb active">{item.emoji}</div>
          </div>
        </div>
        <div className="detail-info">
          <div className="detail-category">{item.cat}</div>
          <h1 className="detail-title">{item.name}</h1>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
            <span className="stars" style={{fontSize:16}}>{'★'.repeat(item.stars) + '☆'.repeat(Math.max(0,5-item.stars))}</span>
            <span style={{fontSize:13,color:'var(--text-muted)'}}>{item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}</span>
          </div>
          <div className="detail-price-row">
            <span className="detail-price">${item.price}</span>
            {item.oldPrice ? <span className="detail-old">${item.oldPrice}</span> : null}
            {item.oldPrice ? <span className="detail-save">Save {Math.round((1 - item.price / item.oldPrice) * 100)}%</span> : null}
          </div>
          <p className="detail-desc">{item.description}</p>
          <div className="detail-tags">
            <span className="tag">{item.brand}</span>
            <span className="tag">{item.isActive ? 'Available' : 'Inactive'}</span>
            <span className="tag">Stock: {item.stock}</span>
          </div>
          <div className="quantity-control">
            <span className="qty-label">Qty</span>
            <div className="qty-box">
              <button className="qty-btn" onClick={()=>changeQty(-1)}>−</button>
              <input type="text" className="qty-num" value={qty} readOnly />
              <button className="qty-btn" onClick={()=>changeQty(1)}>+</button>
            </div>
          </div>
          <div className="detail-actions">
            <button className="btn btn-primary" style={{flex:1}} onClick={addToCartFromDetail} disabled={item.stock <= 0}>{item.stock > 0 ? 'Add to Cart 🛒' : 'Sold Out'}</button>
            <button className="wish-btn" onClick={()=>showToast('❤️','Added to wishlist!')}>♡</button>
          </div>
        </div>
      </div>
    </section>
  );
}
