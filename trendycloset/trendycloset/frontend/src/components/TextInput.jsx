import React from 'react';

/**
 * Props:
 *  - label?: string        (defaults to "Label")
 *  - type?: string         (text, email, number, etc. | default "text")
 *  - value: string|number
 *  - onChange: (e) => void
 *  - placeholder?: string
 *  - name?: string
 *  - autoComplete?: string
 *  - required?: boolean
 *  - error?: string
 *  - ...rest               (any other input props)
 */
export default function TextInput({
  label = 'Label',
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  autoComplete,
  required,
  error,
  ...rest
}) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 600 }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
        required={required}
        style={{
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: 6,
          padding: '8px 10px',
        }}
        {...rest}
      />
      {error && (
        <div style={{ marginTop: 6, color: 'crimson', fontSize: 12 }}>
          {error}
        </div>
      )}
    </label>
  );
}
