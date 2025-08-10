import React, { useState } from 'react';

/**
 * Props:
 *  - label?: string          (default "Password")
 *  - value: string
 *  - onChange: (e) => void
 *  - placeholder?: string
 *  - minLength?: number      (default 6)
 *  - required?: boolean
 *  - error?: string
 */
export default function PasswordInput({
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter password',
  minLength = 6,
  required,
  error,
}) {
  const [show, setShow] = useState(false);

  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 600 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          minLength={minLength}
          required={required}
          style={{
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: '8px 38px 8px 10px',
          }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          style={{
            position: 'absolute',
            right: 6,
            top: 6,
            padding: '4px 8px',
            border: '1px solid #ddd',
            background: '#f9f9f9',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>
        Minimum {minLength} characters.
      </div>
      {error && (
        <div style={{ marginTop: 6, color: 'crimson', fontSize: 12 }}>
          {error}
        </div>
      )}
    </label>
  );
}
