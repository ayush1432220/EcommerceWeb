"use client";
import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

export default function Listing({ products, setPage, addToCart, onSelect, active }){
  const [price, setPrice] = useState(500);
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [rating, setRating] = useState(0);

  const categories = useMemo(()=>['All',...Array.from(new Set(products.map(p=>p.cat)) )], [products]);
  const brands = useMemo(()=>['All',...Array.from(new Set(products.map(p=>p.brand)) )], [products]);

  const filtered = useMemo(()=>{
    return products.filter(p=>{
      if(category !== 'All' && p.cat !== category) return false;
      if(brand !== 'All' && p.brand !== brand) return false;
      if(p.price > price) return false;
      if(rating > 0 && p.stars < rating) return false;
      return true;
    });
  },[products,category,brand,price,rating]);

  function selectCategory(c){ setCategory(c); }
  function selectBrand(b){ setBrand(b); }
  function selectRating(r){ setRating(prev=> prev === r ? 0 : r); }

  return (
    <section className={`page ${active? 'active' : ''}`} id="page-listing">
      <div className="section-header" style={{marginBottom:24}}>
        <div>
          <div className="accent-line"></div>
          <h2 className="section-title">All Products</h2>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-ghost" style={{padding:'10px 16px',fontSize:13}}>Sort ↕</button>
          <button className="btn btn-ghost" style={{padding:'10px 16px',fontSize:13}}>Filter ⚙</button>
        </div>
      </div>
      <div className="listing-layout">
        <aside className="filter-sidebar">
          <div className="filter-title">Filters</div>
          <div className="filter-section">
            <span className="filter-label">Price Range</span>
            <input type="range" className="price-slider" min="0" max="1500" value={price} onChange={(e)=>setPrice(Number(e.target.value))} />
            <div className="price-display"><span>$0</span><span id="priceVal">${price}</span></div>
          </div>
          <div className="filter-section">
            <span className="filter-label">Category</span>
            <div className="filter-chips">
              {categories.map(c=> (
                <button key={c} className={`chip ${c===category ? 'selected' : ''}`} onClick={()=>selectCategory(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <span className="filter-label">Rating</span>
            <div className="star-filter">
              {[5,4,3].map(r=> (
                <div key={r} className="star-row" onClick={()=>selectRating(r)}>
                  <div className={`custom-check ${rating===r? 'checked' : ''}`}>{rating===r ? '✓' : ''}</div>
                  <span className="stars">{'★'.repeat(r) + '☆'.repeat(5-r)}</span>
                  <span className="star-row-label">({r} +)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <span className="filter-label">Brand</span>
            <div className="filter-chips">
              {brands.map(b=> (
                <button key={b} className={`chip ${b===brand? 'selected' : ''}`} onClick={()=>selectBrand(b)}>{b}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={()=>{ setCategory('All'); setBrand('All'); setRating(0); setPrice(1500); }}>Clear Filters</button>
        </aside>
        <div>
          <div className="products-grid" id="listingProducts">
            {filtered.map(p=> <ProductCard key={p.id} p={p} onClick={()=>onSelect(p)} onAdd={addToCart} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
