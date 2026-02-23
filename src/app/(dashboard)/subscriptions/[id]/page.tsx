"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { findKnownLogo } from "@/lib/utils/logos";

const categoryOptions = [
  { value: "STREAMING", label: "Streaming" },
  { value: "GAMING", label: "Gaming" },
  { value: "MUSIC", label: "Música" },
  { value: "PRODUCTIVITY", label: "Productividad" },
  { value: "CLOUD_STORAGE", label: "Almacenamiento en la Nube" },
  { value: "EDUCATION", label: "Educación" },
  { value: "FITNESS", label: "Fitness" },
  { value: "NEWS", label: "Noticias" },
  { value: "SOFTWARE", label: "Software" },
  { value: "OTHER", label: "Otro" },
];

const cycleOptions = [
  { value: "WEEKLY", label: "Semanal" },
  { value: "MONTHLY", label: "Mensual" },
  { value: "QUARTERLY", label: "Trimestral" },
  { value: "SEMI_ANNUAL", label: "Semestral" },
  { value: "ANNUAL", label: "Anual" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Activa" },
  { value: "PAUSED", label: "Pausada" },
  { value: "CANCELLED", label: "Cancelada" },
  { value: "TRIAL", label: "Prueba" },
];

const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "CLP", label: "CLP (Peso Chileno)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "MXN", label: "MXN (Peso Mexicano)" },
  { value: "COP", label: "COP (Peso Colombiano)" },
  { value: "ARS", label: "ARS (Peso Argentino)" },
  { value: "BRL", label: "BRL (R$)" },
];

export default function EditSubscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    url: "",
    price: "",
    currency: "USD",
    cycle: "MONTHLY",
    billingDay: "1",
    category: "OTHER",
    status: "ACTIVE",
    color: "#6366f1",
    notes: "",
  });

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch(`/api/subscriptions/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name ?? "",
            description: data.description ?? "",
            logo: data.logo ?? "",
            url: data.url ?? "",
            price: String(data.price),
            currency: data.currency ?? "USD",
            cycle: data.cycle ?? "MONTHLY",
            billingDay: String(data.billingDay ?? 1),
            category: data.category ?? "OTHER",
            status: data.status ?? "ACTIVE",
            color: data.color ?? "#6366f1",
            notes: data.notes ?? "",
          });
        } else {
          router.push("/subscriptions");
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
        router.push("/subscriptions");
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
  }, [id, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "name" && !prev.logo) {
        const detectedLogo = findKnownLogo(value);
        if (detectedLogo) {
          updated.logo = detectedLogo;
        }
      }
      return updated;
    });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/logo", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Error al subir el archivo");
        return;
      }

      const { url } = await res.json();
      setFormData((prev) => ({ ...prev, logo: url }));
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error al subir el archivo");
    } finally {
      setUploadingLogo(false);
    }
  }

  const previewLogo = formData.logo || findKnownLogo(formData.name);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          billingDay: parseInt(formData.billingDay),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) setErrors(data.details);
        return;
      }

      router.push("/subscriptions");
      router.refresh();
    } catch (error) {
      console.error("Failed to update subscription:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/subscriptions">
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Subscription</h1>
          <p className="text-sm text-white/60">Update {formData.name}</p>
        </div>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white">Basic Information</h3>
              
              {/* Logo Preview */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/10 p-2">
                  {previewLogo ? (
                    <img
                      src={previewLogo}
                      alt="Logo preview"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xl font-bold text-white/40">
                      {formData.name ? formData.name.substring(0, 2).toUpperCase() : "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {formData.name || "Nombre del servicio"}
                  </p>
                  <p className="text-xs text-white/40">
                    {previewLogo ? "Logo detectado automáticamente" : "Ingresa una URL de logo"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="name" name="name" label="Service Name *" value={formData.name} onChange={handleChange} error={errors.name?.[0]} required />
                <Select id="category" name="category" label="Category" options={categoryOptions} value={formData.category} onChange={handleChange} />
              </div>
              <Input id="description" name="description" label="Description" value={formData.description} onChange={handleChange} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="url" name="url" label="Website URL" value={formData.url} onChange={handleChange} />
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Logo
                  </label>
                  <div className="space-y-2">
                    <Input
                      id="logo"
                      name="logo"
                      placeholder="https://ejemplo.com/logo.png"
                      value={formData.logo}
                      onChange={handleChange}
                    />
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-slate-900 px-2 text-white/40">o sube un archivo</span>
                      </div>
                    </div>
                    <label
                      htmlFor="file-upload-edit"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                    >
                      {uploadingLogo ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          Seleccionar archivo
                        </>
                      )}
                    </label>
                    <input
                      id="file-upload-edit"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                    <p className="text-xs text-white/40">PNG, JPG, SVG (máx. 2MB)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <h3 className="text-sm font-medium text-white">Billing Details</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input id="price" name="price" label="Price *" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} error={errors.price?.[0]} required />
                <Select id="currency" name="currency" label="Currency" options={currencyOptions} value={formData.currency} onChange={handleChange} />
                <Select id="cycle" name="cycle" label="Billing Cycle" options={cycleOptions} value={formData.cycle} onChange={handleChange} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="billingDay" name="billingDay" label="Billing Day" type="number" min="1" max="31" value={formData.billingDay} onChange={handleChange} />
                <Select id="status" name="status" label="Status" options={statusOptions} value={formData.status} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <h3 className="text-sm font-medium text-white">Additional</h3>
              <div>
                <label htmlFor="color" className="mb-1.5 block text-sm font-medium text-white">Color Tag</label>
                <div className="flex items-center gap-3">
                  <input type="color" id="color" name="color" value={formData.color} onChange={handleChange} className="h-10 w-14 cursor-pointer rounded-lg border border-white/10" />
                  <span className="text-sm text-white/60">{formData.color}</span>
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-white">Notes</label>
                <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
              <Link href="/subscriptions">
                <Button type="button" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
