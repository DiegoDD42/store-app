'use client';
import { useState, useMemo } from 'react';
import { Button, ListGroup, Alert } from 'react-bootstrap';
import { createOrder } from 'services/api';

export default function CartSidebar({ cart, onIncrement, onDecrement, onClear }) {
  const [status, setStatus] = useState(null);
  const subtotal = useMemo(
    () => cart.reduce((acc, i) => acc + i.quantity * Number(i.price), 0),
    [cart]
  );

  async function handleFinalize() {
    if (cart.length === 0) return;

    setStatus({ type: 'info', text: 'Enviando pedido...' });

    const orderData = {
      items: cart.map(i => ({ productId: i.id, quantity: i.quantity })),
    };

    try {
      const resp = await createOrder(orderData);

      if (resp.error && resp.status === 409) {

        const mapped = resp.data.map(item => {
          const prod = cart.find(p => p.id === item.productId);
          return { ...item, name: prod?.name || `Produto ${item.productId}` };
        });

        setStatus({
          type: 'error',
          text: 'Estoque insuficiente para alguns itens:',
          data: mapped,
        });
        return;
      }

      setStatus({
        type: 'success',
        text: `Pedido criado com sucesso! ID: ${resp.data.id}`,
        data: Array.isArray(resp.data.items) ? resp.data.items : [],
      });

      onClear(); 
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'Erro ao finalizar pedido.' });
    }
  }

  return (
    <aside style={{ width: 360 }} className="border-start ps-3">
      <h5>Carrinho</h5>
      <ListGroup variant="flush" aria-live="polite">
        {cart.length === 0 && <div>Seu carrinho está vazio.</div>}
        {cart.map(item => (
          <ListGroup.Item
            key={item.id}
            className="d-flex align-items-center justify-content-between"
          >
            <div>
              <div><strong>{item.name}</strong></div>
              <div>R$ {Number(item.price).toFixed(2)} x {item.quantity}</div>
            </div>
            <div className="d-flex flex-column align-items-center">
              <Button
                size="sm"
                onClick={() => onIncrement(item.id)}
                aria-label={`Aumentar quantidade de ${item.name}`}
                className="mb-1"
              >
                +
              </Button>
              <Button
                size="sm"
                onClick={() => onDecrement(item.id)}
                aria-label={`Diminuir quantidade de ${item.name}`}
              >
                -
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <div className="mt-3">
        <div role="status" aria-live="polite"><strong>Subtotal:</strong> R$ {subtotal.toFixed(2)}</div>
        <Button
          className="mt-2"
          onClick={handleFinalize}
          disabled={cart.length === 0}
          aria-label="Finalizar pedido"
          variant="success"
        >
          Finalizar
        </Button>
      </div>

      {status && (
        <div className="mt-3" aria-live="polite">
          {status.type === 'success' && (
            <Alert variant="success">
              <div>{status.text}</div>
              <ul>
                {status.data.map((item, idx) => (
                  <li key={idx}>
                    {item.productName} — Quantidade: {item.quantity} — Total: R$ {item.lineTotal.toFixed(2)}
                  </li>
                ))}
              </ul>
            </Alert>
          )}

          {status.type === 'error' && (
            <Alert variant="danger">
              <div>{status.text}</div>
              <ul>
                {status.data.map((item, idx) => (
                  <li key={idx}>
                    {item.name} — Disponível: {item.available}
                  </li>
                ))}
              </ul>
            </Alert>
          )}

          {status.type === 'info' && <Alert variant="info">{status.text}</Alert>}
        </div>
      )}
    </aside>
  );
}
