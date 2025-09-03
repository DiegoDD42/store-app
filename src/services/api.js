const API_URL = 'http://localhost:8080/api/v1';

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return res.json();
}

