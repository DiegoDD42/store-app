'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getProducts } from '@/services/api';
import SearchInput from '@/components/SearchInput';
import ProductsList from '@/components/ProductsList';
import PaginationSimple from '@/components/PaginationSimple';
import CartSidebar from '@/components/CartSidebar';


export default function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const [cart, setCart] = useState([]);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(data => {
        if (Array.isArray(data)) {
          setAllProducts(data);
        } else if (Array.isArray(data.content)) {
          setAllProducts(data.content);
        } else {
          console.error('Formato inesperado:', data);
          setAllProducts([]);
        }
      })
      .catch(err => {
        console.error('Erro ao carregar produtos', err);
        setAllProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = useCallback((product) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  }, []);

  const handleIncrement = useCallback((id) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  }, []);

  const handleDecrement = useCallback((id) => {
    setCart(prev => {
      const found = prev.find(i => i.id === id);
      if (!found) return prev;
      if (found.quantity <= 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  }, []);

  const handleClear = useCallback(() => setCart([]), []);

  const filtered = useMemo(() => {
    if (!query) return allProducts;
    const q = query.toLowerCase();
    return allProducts.filter(p => (p.name || '').toLowerCase().includes(q));
  }, [allProducts, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const currentSlice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={8} lg={9}>
          <h1>Loja</h1>
          <SearchInput onSearch={setQuery} delay={400} />
          {loading ? <p>Carregando produtos...</p> : <ProductsList products={currentSlice} onAdd={handleAdd} />}
          <PaginationSimple page={page} totalPages={totalPages} onChange={setPage} />
        </Col>

        <Col md={4} lg={3}>
          <CartSidebar cart={cart} onIncrement={handleIncrement} onDecrement={handleDecrement} onClear={handleClear} />
        </Col>
      </Row>
    </Container>
  );
}
