import { useState, useEffect, useRef } from "react";
import { getLogoUrl } from "@/lib/utils/logos";

/**
 * Hook que genera una URL de logo auto-detectada con debounce y pre-carga.
 * - Espera a que el usuario deje de escribir (300ms) antes de buscar
 * - Pre-carga la imagen antes de mostrarla (evita el icono de imagen rota)
 * - Si la imagen falla, devuelve null en vez de una URL rota
 *
 * @param name - Nombre del servicio que escribe el usuario
 * @param manualLogo - URL ingresada manualmente (tiene prioridad)
 * @returns { logoUrl, isLoading } - URL validada del logo y estado de carga
 */
export function useLogoPreview(name: string, manualLogo: string) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Si hay un logo manual, usarlo directamente (no debounce)
    if (manualLogo) {
      setLogoUrl(manualLogo);
      setIsLoading(false);
      return;
    }

    // Limpiar timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Abortar carga anterior
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const trimmed = name.trim();
    if (!trimmed) {
      setLogoUrl(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Esperar 400ms después de que el usuario deje de escribir
    debounceRef.current = setTimeout(() => {
      const url = getLogoUrl(trimmed);
      if (!url) {
        setLogoUrl(null);
        setIsLoading(false);
        return;
      }

      // Pre-cargar la imagen antes de mostrarla
      const controller = new AbortController();
      abortRef.current = controller;

      const img = new Image();
      img.onload = () => {
        if (!controller.signal.aborted) {
          setLogoUrl(url);
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        if (!controller.signal.aborted) {
          setLogoUrl(null);
          setIsLoading(false);
        }
      };
      img.src = url;
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [name, manualLogo]);

  return { logoUrl, isLoading };
}
