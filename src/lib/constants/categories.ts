/**
 * Constantes relacionadas con las categorías de suscripciones
 */

// Clases de Tailwind para badges de categoría
export const CATEGORY_COLORS: Record<string, string> = {
  STREAMING: "bg-purple-500",
  GAMING: "bg-red-500",
  MUSIC: "bg-pink-500",
  PRODUCTIVITY: "bg-blue-500",
  CLOUD_STORAGE: "bg-cyan-500",
  EDUCATION: "bg-yellow-500",
  FITNESS: "bg-green-500",
  NEWS: "bg-orange-500",
  SOFTWARE: "bg-indigo-500",
  OTHER: "bg-gray-500",
};

// Colores hex para gráficos (PieChart, etc.)
export const CATEGORY_CHART_COLORS: Record<string, string> = {
  STREAMING: "#a855f7",
  GAMING: "#ef4444",
  MUSIC: "#ec4899",
  PRODUCTIVITY: "#3b82f6",
  CLOUD_STORAGE: "#06b6d4",
  EDUCATION: "#eab308",
  FITNESS: "#22c55e",
  NEWS: "#f97316",
  SOFTWARE: "#6366f1",
  OTHER: "#6b7280",
};

// Labels legibles para las categorías
export const CATEGORY_LABELS: Record<string, string> = {
  STREAMING: "Streaming",
  GAMING: "Gaming",
  MUSIC: "Música",
  PRODUCTIVITY: "Productividad",
  CLOUD_STORAGE: "Almacenamiento",
  EDUCATION: "Educación",
  FITNESS: "Fitness",
  NEWS: "Noticias",
  SOFTWARE: "Software",
  OTHER: "Otro",
};
