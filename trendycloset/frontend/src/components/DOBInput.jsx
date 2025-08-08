import React from 'react';

/**
 * Props:
 *  - label?: string         (defaults to "Date of Birth")
 *  - value: string          (YYYY-MM-DD)
 *  - onChange: (e) => void  (pass straight to parent form state)
 *  - min?: string           (YYYY-MM-DD) optional
 *  - max?: string           (YYYY-MM-DD) optional
 *  - required?: boolean
 *  - error?: string         (optional helper/error text)
 */
export default function DOBInput({
  label = 'Date of Birth',
  value,
  onChange,
  min,
  max,
  required,
  error,
}) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 600 }}>{label}</div>
      <input
        type="date"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        required={required}
        style={{ width: '100%', border: '1px solid #ccc', borderRadius: 6, padding: '8px 10px' }}
      />
      {error && (
        <div style={{ marginTop: 6, color: 'crimson', fontSize: 12 }}>
          {error}
        </div>
      )}
    </label>
  );
}
