import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Download, Eye, Truck } from "lucide-react";

import { deliveriesApi } from "../api/deliveriesApi";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";

import { useDebounce } from "../hooks/useDebounce";
import { usePermissions } from "../hooks/usePermissions";
import { DELIVERY_STATUS_META, PAGE_SIZE } from "../utils/constants";
import { formatDate } from "../utils/formatters";

export default function Deliveries() {
  const { canManageDeliveries } = usePermissions();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const debouncedSearch = useDebounce(search);

  const params = {
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: status || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["deliveries", params],
    queryFn: () => deliveriesApi.list(params),
    keepPreviousData: true,
  });

  const handleExport = async () => {
    try {
      const res = await deliveriesApi.exportExcel(params);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `faisceautrack-livraisons-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  return (
    <>
      <PageHeader
        title="Livraisons"
        subtitle="Gestion et suivi des livraisons de faisceaux"
        actions={
          <>
            <Button variant="secondary" icon={Download} onClick={handleExport}>
              Exporter Excel
            </Button>
            {canManageDeliveries && (
              <Button
                icon={Plus}
                disabled
                title="Disponible à l'étape suivante"
              >
                Nouvelle livraison
              </Button>
            )}
          </>
        }
      />

      {/* Barre d'outils */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Rechercher par n° de livraison..."
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
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tous les statuts</option>
            {Object.entries(DELIVERY_STATUS_META).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <Spinner text="Chargement des livraisons..." />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Truck}
          title="Aucune livraison"
          description={
            search || status
              ? "Aucun résultat pour ces filtres."
              : "Aucune livraison enregistrée pour le moment."
          }
        />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>N° livraison</th>
                  <th>Destination</th>
                  <th>Transporteur</th>
                  <th>Remorque</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((d) => {
                  const meta = DELIVERY_STATUS_META[d.status] || {
                    label: d.status,
                    color: "default",
                  };
                  return (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600 }}>
                        <Link
                          to={`/deliveries/${d.id}`}
                          style={{ color: "var(--color-primary-600)" }}
                        >
                          {d.deliveryNumber}
                        </Link>
                      </td>
                      <td>{d.destination?.name || "—"}</td>
                      <td>{d.transporter?.name || "—"}</td>
                      <td>{d.trailer?.registrationNumber || "—"}</td>
                      <td>
                        <Badge variant={meta.color}>{meta.label}</Badge>
                      </td>
                      <td>{formatDate(d.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <Link
                            to={`/deliveries/${d.id}`}
                            className="btn-icon"
                            title="Voir"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
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
    </>
  );
}
