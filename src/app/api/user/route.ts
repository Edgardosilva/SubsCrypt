import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/utils/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100).optional(),
  image: z.string().url("URL de imagen inválida").or(z.literal("")).optional(),
  currency: z.string().min(3).max(3).optional(),
});

// GET /api/user - Obtener datos del usuario actual
export async function GET() {
  const { session, error } = await getAuthSession();
  if (error) return error;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session!.user!.id! },
      select: { id: true, name: true, email: true, image: true, currency: true, createdAt: true },
    });

    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    return NextResponse.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// PATCH /api/user - Actualizar perfil del usuario
export async function PATCH(req: NextRequest) {
  const { session, error } = await getAuthSession();
  if (error) return error;

  try {
    const body = await req.json();
    const validated = updateProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Si viene image vacío, lo guardamos como null
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.image !== undefined) updateData.image = data.image === "" ? null : data.image;
    if (data.currency !== undefined) updateData.currency = data.currency;

    const updatedUser = await prisma.user.update({
      where: { id: session!.user!.id! },
      data: updateData,
      select: { id: true, name: true, email: true, image: true, currency: true },
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
