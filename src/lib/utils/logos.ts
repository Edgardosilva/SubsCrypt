/**
 * Mapa de logos conocidos para auto-detectar por nombre de suscripción.
 * Usa logos SVG de fuentes públicas (simpleicons.org, clearbit, etc.)
 * Si el usuario no pone un logo URL, se intenta detectar automáticamente.
 */
export const KNOWN_LOGOS: Record<string, string> = {
  netflix: "https://cdn.simpleicons.org/netflix/E50914",
  spotify: "https://cdn.simpleicons.org/spotify/1DB954",
  youtube: "https://cdn.simpleicons.org/youtube/FF0000",
  "youtube premium": "https://cdn.simpleicons.org/youtube/FF0000",
  "youtube music": "https://cdn.simpleicons.org/youtubemusic/FF0000",
  disney: "https://cdn.simpleicons.org/disneyplus/113CCF",
  "disney+": "https://cdn.simpleicons.org/disneyplus/113CCF",
  "disney plus": "https://cdn.simpleicons.org/disneyplus/113CCF",
  hbo: "https://cdn.simpleicons.org/hbo/000000",
  "hbo max": "https://cdn.simpleicons.org/hbo/000000",
  max: "https://cdn.simpleicons.org/hbo/002BE7",
  "amazon prime": "https://cdn.simpleicons.org/amazonprime/00A8E1",
  "prime video": "https://cdn.simpleicons.org/amazonprime/00A8E1",
  "apple tv": "https://cdn.simpleicons.org/appletv/000000",
  "apple music": "https://cdn.simpleicons.org/applemusic/FA243C",
  "apple one": "https://cdn.simpleicons.org/apple/000000",
  crunchyroll: "https://cdn.simpleicons.org/crunchyroll/F47521",
  twitch: "https://cdn.simpleicons.org/twitch/9146FF",
  github: "https://cdn.simpleicons.org/github/FFFFFF",
  "github copilot": "https://cdn.simpleicons.org/githubcopilot/FFFFFF",
  gitlab: "https://cdn.simpleicons.org/gitlab/FC6D26",
  figma: "https://cdn.simpleicons.org/figma/F24E1E",
  canva: "https://cdn.simpleicons.org/canva/00C4CC",
  notion: "https://cdn.simpleicons.org/notion/FFFFFF",
  slack: "https://cdn.simpleicons.org/slack/4A154B",
  zoom: "https://cdn.simpleicons.org/zoom/0B5CFF",
  dropbox: "https://cdn.simpleicons.org/dropbox/0061FF",
  "google one": "https://cdn.simpleicons.org/google/4285F4",
  "google drive": "https://cdn.simpleicons.org/googledrive/4285F4",
  "google workspace": "https://cdn.simpleicons.org/google/4285F4",
  icloud: "https://cdn.simpleicons.org/icloud/3693F3",
  onedrive: "https://cdn.simpleicons.org/microsoftonedrive/0078D4",
  "microsoft 365": "https://cdn.simpleicons.org/microsoft/0078D4",
  office: "https://cdn.simpleicons.org/microsoft/0078D4",
  adobe: "https://cdn.simpleicons.org/adobe/FF0000",
  photoshop: "https://cdn.simpleicons.org/adobephotoshop/31A8FF",
  illustrator: "https://cdn.simpleicons.org/adobeillustrator/FF9A00",
  "creative cloud": "https://cdn.simpleicons.org/adobecreativecloud/DA1F26",
  chatgpt: "https://cdn.simpleicons.org/openai/FFFFFF",
  openai: "https://cdn.simpleicons.org/openai/FFFFFF",
  claude: "https://cdn.simpleicons.org/anthropic/FFFFFF",
  cursor: "https://cdn.simpleicons.org/cursor/FFFFFF",
  "xbox game pass": "https://cdn.simpleicons.org/xbox/107C10",
  xbox: "https://cdn.simpleicons.org/xbox/107C10",
  playstation: "https://cdn.simpleicons.org/playstation/003791",
  "ps plus": "https://cdn.simpleicons.org/playstation/003791",
  nintendo: "https://cdn.simpleicons.org/nintendoswitch/E60012",
  steam: "https://cdn.simpleicons.org/steam/FFFFFF",
  "ea play": "https://cdn.simpleicons.org/ea/FFFFFF",
  duolingo: "https://cdn.simpleicons.org/duolingo/58CC02",
  linkedin: "https://cdn.simpleicons.org/linkedin/0A66C2",
  "linkedin premium": "https://cdn.simpleicons.org/linkedin/0A66C2",
  nordvpn: "https://cdn.simpleicons.org/nordvpn/4687FF",
  expressvpn: "https://cdn.simpleicons.org/expressvpn/DA3940",
  "1password": "https://cdn.simpleicons.org/1password/0094F5",
  bitwarden: "https://cdn.simpleicons.org/bitwarden/175DDC",
  lastpass: "https://cdn.simpleicons.org/lastpass/D32D27",
  deezer: "https://cdn.simpleicons.org/deezer/FEAA2D",
  tidal: "https://cdn.simpleicons.org/tidal/000000",
  paramount: "https://cdn.simpleicons.org/paramountplus/0064FF",
  "paramount+": "https://cdn.simpleicons.org/paramountplus/0064FF",
  "star+": "https://cdn.simpleicons.org/starplus/C724FF",
  starz: "https://cdn.simpleicons.org/starz/000000",
  mubi: "https://cdn.simpleicons.org/mubi/FFFFFF",
  zapping: "https://cdn.simpleicons.org/zap/FFD700",
  mercadolibre: "https://cdn.simpleicons.org/mercadopago/00B1EA",
  "mercadolibre plus": "https://cdn.simpleicons.org/mercadopago/00B1EA",
  vercel: "https://cdn.simpleicons.org/vercel/FFFFFF",
  railway: "https://cdn.simpleicons.org/railway/FFFFFF",
  digitalocean: "https://cdn.simpleicons.org/digitalocean/0080FF",
  aws: "https://cdn.simpleicons.org/amazonaws/FF9900",
  azure: "https://cdn.simpleicons.org/microsoftazure/0078D4",
  heroku: "https://cdn.simpleicons.org/heroku/430098",
  cloudflare: "https://cdn.simpleicons.org/cloudflare/F38020",
};

/**
 * Intenta encontrar un logo conocido a partir del nombre de la suscripción.
 * Busca coincidencias parciales y devuelve la URL del logo o null.
 */
export function findKnownLogo(name: string): string | null {
  const normalized = name.toLowerCase().trim();

  // Coincidencia exacta
  if (KNOWN_LOGOS[normalized]) {
    return KNOWN_LOGOS[normalized];
  }

  // Coincidencia parcial: buscar si el nombre contiene alguna key conocida
  for (const [key, url] of Object.entries(KNOWN_LOGOS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return url;
    }
  }

  return null;
}
