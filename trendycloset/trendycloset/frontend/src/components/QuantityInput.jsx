import React from 'react';

export default function QuantityInput({ value, onChange, min = 1 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <button type="button" onClick={() => onChange(Math.max(min, (value || 1) - 1))}>-</button>
      <input
        type="number"
        value={value || 1}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value || 1)))}
        min={min}
        style={{ width: 60, textAlign: 'center', padding: '6px 8px', border: '1px solid #ccc', borderRadius: 6 }}
      />
      <button type="button" onClick={() => onChange((value || 1) + 1)}>+</button>
    </div>
  );
}
