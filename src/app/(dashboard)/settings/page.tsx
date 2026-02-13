"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-sm text-white/60">Administra las preferencias de tu cuenta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/60">
            La configuración del perfil estará disponible próximamente. ¡Mantente atento!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/60">
            Las preferencias de moneda, notificaciones y visualización llegarán en la Fase 2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
