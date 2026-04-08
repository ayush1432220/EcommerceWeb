"use client";
import ProductCard from './ProductCard';

export default function HomeSection({ products, setPage, addToCart, onSelect, active }){
  return (
    <section className={`page ${active? 'active' : ''}`} id="page-home">
      <div className="hero">
        <div>
          <span className="hero-badge">✨ New Collection 2025</span>
          <h1>Discover Your <em>Perfect</em> Style</h1>
          <p>Curated essentials crafted with intention. Soft aesthetics for modern living.</p>
          <div className="hero-btns">
            <button className="btn btn-primary" onClick={()=>setPage('listing')}>Shop Now →</button>
            <button className="btn btn-ghost" onClick={()=>products[0] ? onSelect(products[0]) : setPage('detail')}>View Featured</button>
          </div>
        </div>
        <div className="hero-img">
          <div className="product-showcase">
            {products.slice(0,4).map(p=> (
              <div key={p.id} className="showcase-item" onClick={()=>onSelect(p)}>
                <div className="showcase-emoji">{p.emoji}</div>
                <div className="showcase-name">{p.name.split(' ')[0]}</div>
                <div className="showcase-price">${p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Shop by Category</h2>
        <button className="section-link" onClick={()=>setPage('listing')}>See all →</button>
      </div>
      <div className="categories-grid">
        <div className="cat-card" onClick={()=>setPage('listing')}><div className="cat-icon">👟</div><div className="cat-name">Footwear</div><div className="cat-count">124 items</div></div>
        <div className="cat-card" onClick={()=>setPage('listing')}><div className="cat-icon">🎧</div><div className="cat-name">Audio</div><div className="cat-count">89 items</div></div>
        <div className="cat-card" onClick={()=>setPage('listing')}><div className="cat-icon">⌚</div><div className="cat-name">Watches</div><div className="cat-count">56 items</div></div>
        <div className="cat-card" onClick={()=>setPage('listing')}><div className="cat-icon">💻</div><div className="cat-name">Tech</div><div className="cat-count">203 items</div></div>
        <div className="cat-card" onClick={()=>setPage('listing')}><div className="cat-icon">👜</div><div className="cat-name">Bags</div><div className="cat-count">78 items</div></div>
        <div className="cat-card" onClick={()=>setPage('listing')}><div className="cat-icon">🕶️</div><div className="cat-name">Eyewear</div><div className="cat-count">45 items</div></div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Trending Now</h2>
        <button className="section-link" onClick={()=>setPage('listing')}>View all →</button>
      </div>
      <div className="products-grid" id="homeProducts">
        {products.slice(0,4).map(p => (
          <ProductCard key={p.id} p={p} onClick={()=>onSelect(p)} onAdd={addToCart} />
        ))}
      </div>
    </section>
  );
}
