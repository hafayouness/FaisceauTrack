import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi } from "../../api/usersApi";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { ROLE_LABELS, ROLES } from "../../utils/constants";

export default function UserForm({ initial, onSuccess, onCancel }) {
  const isEdit = !!initial;

  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
    password: "",
    role: initial?.role || ROLES.VIEWER,
    isActive: initial?.isActive ?? true,
  });
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data };

      // En édition : ne pas envoyer le mot de passe s'il est vide
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      return isEdit
        ? usersApi.update({ id: initial.id, ...payload })
        : usersApi.create(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Utilisateur modifié" : "Utilisateur créé");
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

    // Validation locale
    if (!isEdit && (!form.password || form.password.length < 8)) {
      setErrors({
        password: "Le mot de passe doit contenir au moins 8 caractères",
      });
      return;
    }

    if (isEdit && form.password && form.password.length < 8) {
      setErrors({
        password: "Le mot de passe doit contenir au moins 8 caractères",
      });
      return;
    }

    mutation.mutate(form);
  };

  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <form onSubmit={handleSubmit} id="user-form">
      <Input
        label="Nom complet"
        required
        placeholder="Youness Hafa"
        value={form.name}
        error={errors.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        label="Email"
        type="email"
        required
        placeholder="utilisateur@faisceautrack.com"
        value={form.email}
        error={errors.email}
        disabled={isEdit}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <Input
        label={
          isEdit
            ? "Nouveau mot de passe (laisser vide pour conserver)"
            : "Mot de passe"
        }
        type="password"
        required={!isEdit}
        placeholder={isEdit ? "•••••••• (optionnel)" : "Au moins 8 caractères"}
        value={form.password}
        error={errors.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <Select
        label="Rôle"
        required
        value={form.role}
        error={errors.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        options={roleOptions}
      />

      {isEdit ? (
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
            <span style={{ fontSize: 13, fontWeight: 500 }}>Compte actif</span>
          </label>
        </div>
      ) : null}
    </form>
  );
}
