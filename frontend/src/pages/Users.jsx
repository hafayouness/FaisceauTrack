import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  Pencil,
  UserX,
  Users as UsersIcon,
  ShieldCheck,
} from "lucide-react";

import { usersApi } from "../api/usersApi";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import UserForm from "../components/forms/UserForm";

import { useDebounce } from "../hooks/useDebounce";
import { ROLE_LABELS, ROLES, PAGE_SIZE } from "../utils/constants";
import { initials, formatDateTime } from "../utils/formatters";

/* Couleur du badge selon le rôle */
const ROLE_COLORS = {
  [ROLES.ADMIN]: "danger",
  [ROLES.LOGISTIC_MANAGER]: "primary",
  [ROLES.RECEPTION]: "info",
  [ROLES.VIEWER]: "default",
};

export default function Users() {
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const debouncedSearch = useDebounce(search);

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const params = {
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    role: role || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["users", params],
    queryFn: () => usersApi.list(params),
    keepPreviousData: true,
  });

  const deactivateMutation = useMutation({
    mutationFn: usersApi.deactivate,
    onSuccess: () => {
      toast.success("Utilisateur désactivé");
      qc.invalidateQueries({ queryKey: ["users"] });
      setDeactivateTarget(null);
    },
  });

  const handleSaved = () => {
    setShowForm(false);
    setEditItem(null);
    qc.invalidateQueries({ queryKey: ["users"] });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditItem(null);
  };

  return (
    <>
      <PageHeader
        title="Utilisateurs"
        subtitle="Gestion des comptes et rôles d'accès"
        actions={
          <Button icon={Plus} onClick={() => setShowForm(true)}>
            Nouvel utilisateur
          </Button>
        }
      />

      {/* Barre d'outils */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Rechercher par nom ou email..."
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
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tous les rôles</option>
            {Object.entries(ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <Spinner text="Chargement des utilisateurs..." />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={UsersIcon}
          title="Aucun utilisateur"
          description={
            search || role
              ? "Aucun résultat pour ces filtres."
              : "Créez le premier compte utilisateur."
          }
          action={
            !search && !role ? (
              <Button icon={Plus} onClick={() => setShowForm(true)}>
                Créer un utilisateur
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Dernière connexion</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((u) => (
                  <tr key={u.id}>
                    {/* Utilisateur (avatar + nom + email) */}
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div className="avatar">{initials(u.name)}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div className="text-muted text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Rôle */}
                    <td>
                      <Badge variant={ROLE_COLORS[u.role] || "default"}>
                        {ROLE_LABELS[u.role] || u.role}
                      </Badge>
                    </td>

                    {/* Statut */}
                    <td>
                      <Badge variant={u.isActive ? "success" : "default"}>
                        {u.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>

                    {/* Dernière connexion */}
                    <td className="text-muted">
                      {u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "Jamais"}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-icon"
                          onClick={() => setEditItem(u)}
                          title="Modifier"
                        >
                          <Pencil size={16} />
                        </button>
                        {u.isActive ? (
                          <button
                            className="btn-icon"
                            style={{ color: "var(--color-danger)" }}
                            onClick={() => setDeactivateTarget(u)}
                            title="Désactiver"
                          >
                            <UserX size={16} />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </>
      )}

      {/* Modal création / édition */}
      <Modal
        open={showForm || !!editItem}
        onClose={handleCancel}
        title={editItem ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
        footer={
          <>
            <Button variant="secondary" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" form="user-form">
              {editItem ? "Enregistrer" : "Créer"}
            </Button>
          </>
        }
      >
        <UserForm
          initial={editItem}
          onSuccess={handleSaved}
          onCancel={handleCancel}
        />
      </Modal>

      {/* Confirmation désactivation */}
      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={() => deactivateMutation.mutate(deactivateTarget.id)}
        title="Désactiver l'utilisateur"
        message={`Voulez-vous vraiment désactiver le compte de "${deactivateTarget?.name}" ? L'utilisateur ne pourra plus se connecter.`}
        confirmLabel="Désactiver"
        loading={deactivateMutation.isPending}
      />
    </>
  );
}
