'use client';
import Pagination from 'react-bootstrap/Pagination';

export default function PaginationSimple({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const items = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  if (page > 1) items.push(<Pagination.Prev key="prev" onClick={() => onChange(page - 1)} aria-label="Página anterior" />);
  for (let i = start; i <= end; i++) {
    items.push(
      <Pagination.Item key={i} active={i === page} onClick={() => onChange(i)} aria-label={`Ir para a página ${i}`}>
        {i}
      </Pagination.Item>
    );
  }
  if (page < totalPages) items.push(<Pagination.Next key="next" onClick={() => onChange(page + 1)} aria-label="Próxima página" />);

  return <Pagination className="mt-3">{items}</Pagination>;
}
