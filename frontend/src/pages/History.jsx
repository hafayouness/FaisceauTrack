import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, History as HistoryIcon, Eye, Download } from "lucide-react";

import { historyApi } from "../api/historyApi";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";

import { useDebounce } from "../hooks/useDebounce";
import {
  HISTORY_ACTION_META,
  HISTORY_ENTITIES,
  PAGE_SIZE,
} from "../utils/constants";
import { formatDateTime, initials } from "../utils/formatters";

export default function History() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [detail, setDetail] = useState(null);

  const debouncedSearch = useDebounce(search);

  const params = {
    page,
    limit: PAGE_SIZE,
    action: action || undefined,
    entity: entity || undefined,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["history", params],
    queryFn: () => historyApi.list(params),
    keepPreviousData: true,
  });

  const handleExportCSV = () => {
    if (!data?.data?.length) return;

    const rows = data.data.map((h) => ({
      Date: formatDateTime(h.createdAt),
      Utilisateur: h.user?.name || "—",
      Email: h.user?.email || "—",
      Action: HISTORY_ACTION_META[h.action]?.label || h.action,
      Entité: HISTORY_ENTITIES[h.entity] || h.entity,
      "ID Entité": h.entityId || "—",
      "Adresse IP": h.ipAddress || "—",
    }));

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(";"),
      ...rows.map((r) =>
        headers.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(";"),
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `faisceautrack-historique-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Historique & Audit"
        subtitle="Traçabilité complète des opérations effectuées"
        actions={
          <Button
            variant="secondary"
            icon={Download}
            onClick={handleExportCSV}
            disabled={!data?.data?.length}
          >
            Exporter CSV
          </Button>
        }
      />

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Rechercher dans les détails..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filters">
          <select
            className="filter-select"
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Toutes les actions</option>
            {Object.entries(HISTORY_ACTION_META).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={entity}
            onChange={(e) => {
              setEntity(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Toutes les entités</option>
            {Object.entries(HISTORY_ENTITIES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <Spinner text="Chargement de l'historique..." />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={HistoryIcon}
          title="Aucune entrée d'historique"
          description={
            search || action || entity
              ? "Aucun résultat pour ces filtres."
              : "Les opérations effectuées apparaîtront ici."
          }
        />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table table-centered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Utilisateur</th>
                  <th>Action</th>
                  <th>Entité</th>
                  <th>ID Entité</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((h) => {
                  const meta = HISTORY_ACTION_META[h.action] || {
                    label: h.action,
                    color: "default",
                  };
                  return (
                    <tr key={h.id}>
                      {/* Date */}
                      <td className="text-muted" style={{ fontSize: 13 }}>
                        {formatDateTime(h.createdAt)}
                      </td>

                      {/* Utilisateur */}
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            className="avatar"
                            style={{
                              width: 28,
                              height: 28,
                              fontSize: 11,
                            }}
                          >
                            {initials(h.user?.name)}
                          </div>
                          <div style={{ textAlign: "left" }}>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 13,
                              }}
                            >
                              {h.user?.name || "—"}
                            </div>
                            <div className="text-muted text-xs">
                              {h.user?.email || ""}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td>
                        <Badge variant={meta.color}>{meta.label}</Badge>
                      </td>

                      {/* Entité */}
                      <td style={{ fontWeight: 500 }}>
                        {HISTORY_ENTITIES[h.entity] || h.entity}
                      </td>

                      {/* ID Entité */}
                      <td>
                        <code
                          className="text-muted text-xs"
                          style={{
                            fontFamily:
                              "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          {h.entityId ? h.entityId.slice(0, 8) + "…" : "—"}
                        </code>
                      </td>

                      {/* Détails */}
                      <td>
                        <button
                          className="btn-icon"
                          title="Voir les détails"
                          onClick={() => setDetail(h)}
                          style={{ margin: "0 auto" }}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </>
      )}

      {/* Modal détails */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title="Détails de l'opération"
        size="lg"
      >
        {detail ? <DetailContent detail={detail} /> : null}
      </Modal>
    </>
  );
}

/* =========================================================
   Contenu du modal détails
   ========================================================= */
function DetailContent({ detail }) {
  const meta = HISTORY_ACTION_META[detail.action] || {
    label: detail.action,
    color: "default",
  };

  return (
    <>
      <div className="detail-list" style={{ marginBottom: 20 }}>
        <Info label="Date" value={formatDateTime(detail.createdAt)} />
        <Info label="Utilisateur" value={detail.user?.name} />
        <Info label="Email" value={detail.user?.email} />
        <Info
          label="Action"
          value={<Badge variant={meta.color}>{meta.label}</Badge>}
        />
        <Info
          label="Entité"
          value={HISTORY_ENTITIES[detail.entity] || detail.entity}
        />
        <Info label="ID Entité" value={detail.entityId} />
        <Info label="Adresse IP" value={detail.ipAddress} />
      </div>

      {detail.details ? (
        <div>
          <div className="detail-label" style={{ marginBottom: 8 }}>
            Données
          </div>
          <pre
            style={{
              background: "#0f172a",
              color: "#e2e8f0",
              padding: 16,
              borderRadius: 10,
              overflow: "auto",
              fontSize: 12,
              lineHeight: 1.6,
              maxHeight: 400,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              margin: 0,
            }}
          >
            {JSON.stringify(detail.details, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-muted">Aucune donnée détaillée disponible.</p>
      )}
    </>
  );
}

function Info({ label, value }) {
  return (
    <div className="detail-item">
      <div className="detail-label">{label}</div>
      <div className="detail-value">{value || "—"}</div>
    </div>
  );
}
