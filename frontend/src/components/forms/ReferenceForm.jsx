import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { referencesApi } from "../../api/referencesApi";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { DEFAULT_UNIT } from "../../utils/constants";

const UNIT_OPTIONS = [
  { value: "PCS", label: "PCS — Pièces" },

  { value: "M2", label: "M² — Mètres carrés" },
  { value: "M3", label: "M³ — Mètres cubes" },
];

export default function ReferenceForm({ initial, onSuccess, onCancel }) {
  const isEdit = !!initial;

  const [form, setForm] = useState({
    code: initial?.code || "",
    description: initial?.description || "",
    unit: initial?.unit || DEFAULT_UNIT,
    isActive: initial?.isActive ?? true,
  });
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit
        ? referencesApi.update({ id: initial.id, ...data })
        : referencesApi.create(data),
    onSuccess: () => {
      toast.success(isEdit ? "Référence modifiée" : "Référence créée");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    mutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} id="reference-form">
      <Input
        label="Code"
        required
        placeholder="FA-001"
        value={form.code}
        error={errors.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
      />

      <Input
        label="Description"
        placeholder="Description de la référence..."
        value={form.description}
        error={errors.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <Select
        label="Unité"
        required
        value={form.unit}
        error={errors.unit}
        onChange={(e) => setForm({ ...form, unit: e.target.value })}
        options={UNIT_OPTIONS}
      />

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            Référence active
          </span>
        </label>
      </div>
    </form>
  );
}
