import React from 'react';

export default function ProductCard({ product, onAdd }) {
  return (
    <div style={card}>
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.title} style={img} />
      ) : (
        <div style={phImg} />
      )}
      <div style={{ fontWeight: 700 }}>{product.title}</div>
      <div style={{ color: '#666', fontSize: 13 }}>{product.description || '—'}</div>
      <div style={{ marginTop: 6 }}>£{Number(product.price || 0).toFixed(2)}</div>
      <button onClick={() => onAdd?.(product)} style={btn} disabled={product.stock <= 0}>
        {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
      </button>
    </div>
  );
}

const card = { border: '1px solid #eee', borderRadius: 10, padding: 12, background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 };
const img = { width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, background: '#f0f0f0' };
const phImg = { ...img, background: '#f5f5f5' };
const btn = { padding: '8px 12px', borderRadius: 8, border: '1px solid #000', background: '#000', color: '#fff' };
