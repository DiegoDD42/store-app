const API_URL = 'http://localhost:8080/api/v1';

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return res.json();
}

export async function createOrder(orderData) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    
    if (res.status === 409) {
      return { error: true, status: 409, data };
    }
    throw new Error(data?.message || 'Erro ao criar pedido');
  }

  return { error: false, status: res.status, data };
}

