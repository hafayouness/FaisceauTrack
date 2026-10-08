import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination) return null;

  const { page, limit, total, totalPages } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Pages à afficher (max 5 autour de la page courante)
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination">
      <div className="pagination-info">
        {total === 0 ? "Aucun résultat" : `${from}–${to} sur ${total}`}
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Première page + ... */}
        {start > 1 && (
          <>
            <button className="pagination-btn" onClick={() => onPageChange(1)}>
              1
            </button>
            {start > 2 && <span style={{ padding: "0 6px" }}>…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            className={`pagination-btn ${p === page ? "active" : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        {/* Dernière page + ... */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span style={{ padding: "0 6px" }}>…</span>
            )}
            <button
              className="pagination-btn"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className="pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
