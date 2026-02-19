"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@/lib/utils/currency";

interface PreferencesSectionProps {
  initialCurrency: string;
  onPreferencesUpdate: (currency: string) => void;
}

export function PreferencesSection({ initialCurrency, onPreferencesUpdate }: PreferencesSectionProps) {
  const [currency, setCurrency] = useState(initialCurrency);
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefMsg, setPrefMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handlePreferencesSave() {
    setPrefSaving(true);
    setPrefMsg(null);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });
      if (!res.ok) throw new Error();
      onPreferencesUpdate(currency);
      setPrefMsg({ type: "success", text: "Preferencias guardadas correctamente." });
    } catch {
      setPrefMsg({ type: "error", text: "Error al guardar. Inténtalo de nuevo." });
    } finally {
      setPrefSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferencias</CardTitle>
        <CardDescription>Moneda predeterminada usada en todas tus suscripciones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          id="currency"
          label="Moneda predeterminada"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          options={SUPPORTED_CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
        />

        {prefMsg && (
          <p className={`text-sm ${prefMsg.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
            {prefMsg.text}
          </p>
        )}

        <div className="flex justify-end">
          <Button onClick={handlePreferencesSave} disabled={prefSaving}>
            {prefSaving ? "Guardando..." : "Guardar preferencias"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
