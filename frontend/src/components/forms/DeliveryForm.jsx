import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

import { deliveriesApi } from "../../api/deliveriesApi";
import { referencesApi } from "../../api/referencesApi";
import {
  trailersApi,
  transportersApi,
  destinationsApi,
} from "../../api/crudApi";

import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

import { DELIVERY_STATUS_META, DEFAULT_UNIT } from "../../utils/constants";

const UNIT_OPTIONS = [
  { value: "PCS", label: "PCS" },
  { value: "M", label: "M" },
  { value: "M2", label: "M²" },
  { value: "M3", label: "M³" },
  { value: "KG", label: "KG" },
  { value: "L", label: "L" },
  { value: "ML", label: "ML" },
];

/* 🛡️ Helper robuste : extrait un tableau quoi qu'il arrive */
const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

export default function DeliveryForm({ initial, onSuccess, onCancel }) {
  const isEdit = !!initial;

  const locked =
    isEdit &&
    [
      "IN_TRANSIT",
      "ARRIVED",
      "PARTIAL_RECEPTION",
      "RECEIVED",
      "CANCELLED",
    ].includes(initial.status);

  const [form, setForm] = useState({
    deliveryNumber: initial?.deliveryNumber || "",
    destinationId: initial?.destinationId || "",
    transporterId: initial?.transporterId || "",
    trailerId: initial?.trailerId || "",
    status: initial?.status || "PREPARATION",
    preparationDate: initial?.preparationDate?.slice(0, 16) || "",
    departureDate: initial?.departureDate?.slice(0, 16) || "",
    arrivalDate: initial?.arrivalDate?.slice(0, 16) || "",
    notes: initial?.notes || "",
  });

  const [items, setItems] = useState(
    initial?.items?.map((i) => ({
      referenceId: i.referenceId,
      quantity: i.quantity,
      unit: i.unit || DEFAULT_UNIT,
    })) || [{ referenceId: "", quantity: "", unit: DEFAULT_UNIT }],
  );

  const [errors, setErrors] = useState({});

  /* ---------- Fetch référentiels ---------- */
  const { data: refsData } = useQuery({
    queryKey: ["references-all"],
    queryFn: () => referencesApi.list({ limit: 500 }),
  });

  const { data: trailersData } = useQuery({
    queryKey: ["trailers-all"],
    queryFn: () => trailersApi.list({ limit: 500 }),
  });

  const { data: transportersData } = useQuery({
    queryKey: ["transporters-all"],
    queryFn: () => transportersApi.list({ limit: 500 }),
  });

  const { data: destinationsData } = useQuery({
    queryKey: ["destinations-all"],
    queryFn: () => destinationsApi.list({ limit: 500 }),
  });

  /* ---------- Mutation ---------- */
  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit
        ? deliveriesApi.update({ id: initial.id, ...payload })
        : deliveriesApi.create(payload),
    onSuccess: () => {
      toast.success(isEdit ? "Livraison modifiée" : "Livraison créée");
      onSuccess?.();
    },
    onError: (err) => {
      const details = err.response?.data?.errors;
      if (Array.isArray(details)) {
        const map = {};
        details.forEach((e) => (map[e.field || e.param] = e.message));
        setErrors(map);
      }
    },
  });

  /* ---------- Gestion des items ---------- */
  const addItem = () =>
    setItems([...items, { referenceId: "", quantity: "", unit: DEFAULT_UNIT }]);

  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const updateItem = (idx, patch) =>
    setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  /* ---------- Submit ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (
      !form.deliveryNumber ||
      !form.destinationId ||
      !form.transporterId ||
      !form.trailerId
    ) {
      toast.error("Veuillez renseigner les informations obligatoires");
      return;
    }

    const validItems = items
      .filter((i) => i.referenceId && i.quantity)
      .map((i) => ({
        referenceId: i.referenceId,
        quantity: Number(i.quantity),
        unit: i.unit,
      }));

    if (!validItems.length) {
      toast.error("Ajoutez au moins une référence");
      return;
    }

    const ids = validItems.map((i) => i.referenceId);
    if (new Set(ids).size !== ids.length) {
      toast.error(
        "Une référence ne peut apparaître qu'une seule fois dans une livraison",
      );
      return;
    }

    const payload = {
      ...form,
      destinationId: Number(form.destinationId),
      transporterId: Number(form.transporterId),
      trailerId: Number(form.trailerId),
      items: validItems,
    };

    ["preparationDate", "departureDate", "arrivalDate"].forEach((k) => {
      if (!payload[k]) payload[k] = null;
    });

    mutation.mutate(payload);
  };

  /* ---------- Options des selects (ROBUSTE) ---------- */
  const refsOptions = toArray(refsData)
    .filter((r) => r.isActive)
    .map((r) => ({
      value: r.id,
      label: `${r.code}${r.description ? ` — ${r.description}` : ""}`,
    }));

  const trailersOptions = toArray(trailersData)
    .filter((t) => t.isActive)
    .map((t) => ({ value: t.id, label: t.registrationNumber }));

  const transportersOptions = toArray(transportersData)
    .filter((t) => t.isActive)
    .map((t) => ({ value: t.id, label: t.name }));

  const destinationsOptions = toArray(destinationsData)
    .filter((d) => d.isActive)
    .map((d) => ({ value: d.id, label: d.name }));

  /* ---------- Debug (à retirer plus tard) ---------- */
  console.log("refsData:", refsData);
  console.log("refsOptions:", refsOptions);
  console.log("trailersOptions:", trailersOptions);

  /* ---------- Rendu ---------- */
  return (
    <form onSubmit={handleSubmit} id="delivery-form">
      <Input
        label="N° de livraison"
        required
        placeholder="DL-2026-001"
        value={form.deliveryNumber}
        error={errors.deliveryNumber}
        disabled={isEdit}
        onChange={(e) => setForm({ ...form, deliveryNumber: e.target.value })}
      />

      <div className="form-row">
        <Select
          label="Destination"
          required
          placeholder="Sélectionner..."
          value={form.destinationId}
          error={errors.destinationId}
          onChange={(e) => setForm({ ...form, destinationId: e.target.value })}
          options={destinationsOptions}
        />

        <Select
          label="Transporteur"
          required
          placeholder="Sélectionner..."
          value={form.transporterId}
          error={errors.transporterId}
          onChange={(e) => setForm({ ...form, transporterId: e.target.value })}
          options={transportersOptions}
        />
      </div>

      <div className="form-row">
        <Select
          label="Remorque"
          required
          placeholder="Sélectionner..."
          value={form.trailerId}
          error={errors.trailerId}
          onChange={(e) => setForm({ ...form, trailerId: e.target.value })}
          options={trailersOptions}
        />

        <Select
          label="Statut"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={Object.entries(DELIVERY_STATUS_META).map(
            ([value, meta]) => ({ value, label: meta.label }),
          )}
        />
      </div>

      <div className="form-row-3">
        <Input
          label="Préparation"
          type="datetime-local"
          value={form.preparationDate}
          onChange={(e) =>
            setForm({ ...form, preparationDate: e.target.value })
          }
        />
        <Input
          label="Départ"
          type="datetime-local"
          value={form.departureDate}
          onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
        />
        <Input
          label="Arrivée"
          type="datetime-local"
          value={form.arrivalDate}
          onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea
          className="form-textarea"
          rows={2}
          placeholder="Commentaires éventuels..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <label className="form-label" style={{ margin: 0 }}>
            Références <span className="required">*</span>
          </label>
          {!locked ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={addItem}
            >
              Ajouter
            </Button>
          ) : null}
        </div>

        {locked ? (
          <div
            style={{
              padding: 10,
              background: "var(--color-warning-bg)",
              color: "#92400e",
              borderRadius: 8,
              fontSize: 12.5,
              marginBottom: 10,
            }}
          >
            ⚠️ Les références ne peuvent plus être modifiées après le départ.
          </div>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 110px 90px 40px",
                gap: 8,
                alignItems: "center",
              }}
            >
              <select
                className="form-select"
                value={item.referenceId}
                disabled={locked}
                onChange={(e) =>
                  updateItem(idx, { referenceId: e.target.value })
                }
              >
                <option value="">Référence...</option>
                {refsOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                step="1"
                className="form-input"
                placeholder="Qté"
                value={item.quantity}
                disabled={locked}
                onChange={(e) => updateItem(idx, { quantity: e.target.value })}
              />

              <select
                className="form-select"
                value={item.unit}
                disabled={locked}
                onChange={(e) => updateItem(idx, { unit: e.target.value })}
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>

              {!locked && items.length > 1 ? (
                <button
                  type="button"
                  className="btn-icon"
                  style={{ color: "var(--color-danger)" }}
                  onClick={() => removeItem(idx)}
                  title="Retirer"
                >
                  <Trash2 size={16} />
                </button>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
