'use client';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';

export default function SearchInput({ onSearch, delay = 500 }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const t = setTimeout(() => onSearch(value.trim()), delay);
    return () => clearTimeout(t);
  }, [value, onSearch, delay]);

  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="search-input" className="visually-hidden">Buscar produtos</Form.Label>
      <Form.Control
        id="search-input"
        placeholder="Buscar produtos..."
        value={value}
        onChange={e => setValue(e.target.value)}
        aria-label="Buscar produtos"
      />
    </Form.Group>
  );
}
