"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SessionSection() {
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sesión</CardTitle>
        <CardDescription>Cierra tu sesión en este dispositivo</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="destructive"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </Button>
      </CardContent>
    </Card>
  );
}
