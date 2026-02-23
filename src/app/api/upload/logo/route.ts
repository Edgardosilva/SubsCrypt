import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

/**
 * POST /api/upload/logo
 * Sube un logo de suscripción a Vercel Blob Storage
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no válido. Usa PNG, JPG, GIF, WebP o SVG" },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Máximo 2MB" },
        { status: 400 }
      );
    }

    // Generar nombre único
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `logos/${session.user.id}/${timestamp}-${sanitizedName}`;

    // Subir a Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      filename: blob.pathname,
    });
  } catch (error) {
    console.error("Error uploading logo:", error);
    return NextResponse.json(
      { error: "Error al subir el archivo" },
      { status: 500 }
    );
  }
}
