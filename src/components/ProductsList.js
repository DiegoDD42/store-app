'use client';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function ProductsList({ products, onAdd }) {
  if (!products || products.length === 0) return <p>Nenhum produto encontrado.</p>;

  return (
    <Row xs={1} md={2} lg={3} className="g-3">
      {products.map(p => (
        <Col key={p.id}>
          <Card>
            <Card.Body>
              <Card.Title>{p.name}</Card.Title>
              <Card.Text>Preço: R$ {Number(p.price).toFixed(2)}</Card.Text>
              <Card.Text>Estoque: {p.stock ?? '—'}</Card.Text>
              <Button
                onClick={() => onAdd(p)}
                aria-label={`Adicionar ${p.name} ao carrinho`}
                variant="primary"
              >
                Adicionar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
