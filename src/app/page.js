'use client';
import { useEffect, useState, useMemo } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getProducts } from '@/services/api';
import SearchInput from '@/components/SearchInput';
import ProductsList from '@/components/ProductsList';
import PaginationSimple from '@/components/PaginationSimple';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 9;

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
        <Col>
          <h1>Loja</h1>
          <SearchInput onSearch={setQuery} delay={400} />
          {loading ? (
            <p>Carregando produtos...</p>
          ) : (
            <ProductsList products={currentSlice} />
          )}
          <PaginationSimple page={page} totalPages={totalPages} onChange={setPage} />
        </Col>
      </Row>
    </Container>
  );
}
