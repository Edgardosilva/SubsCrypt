import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { getAuthSession } from "@/lib/utils/auth-helpers";
import { prisma } from "@/lib/prisma";

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// POST /api/user/avatar - Subir foto de perfil
export async function POST(req: NextRequest) {
  const { session, error } = await getAuthSession();
  if (error) return error;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato no permitido. Usa JPG, PNG, WebP o GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json(
      { error: `El archivo no puede superar los ${MAX_SIZE_MB} MB.` },
      { status: 400 }
    );
  }

  try {
    const userId = session!.user!.id!;
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `avatars/${userId}.${ext}`;

    // Eliminar avatar anterior si existe en Vercel Blob
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    if (
      currentUser?.image &&
      currentUser.image.includes("public.blob.vercel-storage.com")
    ) {
      await del(currentUser.image).catch(() => null); // silenciar si falla
    }

    // Subir nuevo archivo
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    // Actualizar la URL en la base de datos
    await prisma.user.update({
      where: { id: userId },
      data: { image: blob.url },
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Error subiendo avatar:", err);
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}
