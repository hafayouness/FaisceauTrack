import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { transportersApi } from "../../api/transportersApi";
import Input from "../ui/Input";

export default function TransporterForm({ initial, onSuccess, onCancel }) {
  const isEdit = !!initial;

  const [form, setForm] = useState({
    name: initial?.name || "",
    company: initial?.company || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    isActive: initial?.isActive ?? true,
  });
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit
        ? transportersApi.update({ id: initial.id, ...data })
        : transportersApi.create(data),
    onSuccess: () => {
      toast.success(isEdit ? "Transporteur modifié" : "Transporteur créé");
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
    <form onSubmit={handleSubmit} id="transporter-form">
      <Input
        label="Nom"
        required
        placeholder="Transport XYZ"
        value={form.name}
        error={errors.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        label="Société"
        placeholder="Nom de la société (optionnel)"
        value={form.company}
        error={errors.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />

      <div className="form-row">
        <Input
          label="Téléphone"
          placeholder="+33 6 12 34 56 78"
          value={form.phone}
          error={errors.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="contact@transport.com"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

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
            Transporteur actif
          </span>
        </label>
      </div>
    </form>
  );
}
