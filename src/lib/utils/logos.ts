/**
 * Genera una URL de logo dinámica usando cdn.simpleicons.org
 * El CDN devuelve un SVG si el icono existe, o un 404 si no.
 * Esto permite auto-detectar logos en tiempo real mientras el usuario escribe.
 */
export function getLogoUrl(name: string): string | null {
  const normalized = name.toLowerCase().trim().replace(/\s+/g, "");
  if (!normalized) return null;

  // Aliases para nombres que no coinciden 1:1 con simpleicons
  const aliases: Record<string, { slug: string; color: string }> = {
    netflix: { slug: "netflix", color: "E50914" },
    spotify: { slug: "spotify", color: "1DB954" },
    youtube: { slug: "youtube", color: "FF0000" },
    youtubepremium: { slug: "youtube", color: "FF0000" },
    youtubemusic: { slug: "youtubemusic", color: "FF0000" },
    disney: { slug: "disneyplus", color: "113CCF" },
    "disney+": { slug: "disneyplus", color: "113CCF" },
    disneyplus: { slug: "disneyplus", color: "113CCF" },
    hbo: { slug: "hbo", color: "000000" },
    hbomax: { slug: "hbo", color: "000000" },
    max: { slug: "hbo", color: "002BE7" },
    amazonprime: { slug: "amazonprime", color: "00A8E1" },
    primevideo: { slug: "amazonprime", color: "00A8E1" },
    appletv: { slug: "appletv", color: "000000" },
    applemusic: { slug: "applemusic", color: "FA243C" },
    appleone: { slug: "apple", color: "000000" },
    crunchyroll: { slug: "crunchyroll", color: "F47521" },
    twitch: { slug: "twitch", color: "9146FF" },
    github: { slug: "github", color: "FFFFFF" },
    githubcopilot: { slug: "githubcopilot", color: "FFFFFF" },
    gitlab: { slug: "gitlab", color: "FC6D26" },
    figma: { slug: "figma", color: "F24E1E" },
    canva: { slug: "canva", color: "00C4CC" },
    notion: { slug: "notion", color: "FFFFFF" },
    slack: { slug: "slack", color: "4A154B" },
    zoom: { slug: "zoom", color: "0B5CFF" },
    dropbox: { slug: "dropbox", color: "0061FF" },
    googleone: { slug: "google", color: "4285F4" },
    googledrive: { slug: "googledrive", color: "4285F4" },
    googleworkspace: { slug: "google", color: "4285F4" },
    icloud: { slug: "icloud", color: "3693F3" },
    onedrive: { slug: "microsoftonedrive", color: "0078D4" },
    microsoft365: { slug: "microsoft", color: "0078D4" },
    office: { slug: "microsoft", color: "0078D4" },
    adobe: { slug: "adobe", color: "FF0000" },
    photoshop: { slug: "adobephotoshop", color: "31A8FF" },
    illustrator: { slug: "adobeillustrator", color: "FF9A00" },
    creativecloud: { slug: "adobecreativecloud", color: "DA1F26" },
    chatgpt: { slug: "openai", color: "FFFFFF" },
    openai: { slug: "openai", color: "FFFFFF" },
    claude: { slug: "anthropic", color: "FFFFFF" },
    cursor: { slug: "cursor", color: "FFFFFF" },
    xboxgamepass: { slug: "xbox", color: "107C10" },
    xbox: { slug: "xbox", color: "107C10" },
    playstation: { slug: "playstation", color: "003791" },
    psplus: { slug: "playstation", color: "003791" },
    nintendo: { slug: "nintendoswitch", color: "E60012" },
    steam: { slug: "steam", color: "FFFFFF" },
    eaplay: { slug: "ea", color: "FFFFFF" },
    duolingo: { slug: "duolingo", color: "58CC02" },
    linkedin: { slug: "linkedin", color: "0A66C2" },
    linkedinpremium: { slug: "linkedin", color: "0A66C2" },
    nordvpn: { slug: "nordvpn", color: "4687FF" },
    expressvpn: { slug: "expressvpn", color: "DA3940" },
    "1password": { slug: "1password", color: "0094F5" },
    bitwarden: { slug: "bitwarden", color: "175DDC" },
    lastpass: { slug: "lastpass", color: "D32D27" },
    deezer: { slug: "deezer", color: "FEAA2D" },
    tidal: { slug: "tidal", color: "000000" },
    paramount: { slug: "paramountplus", color: "0064FF" },
    "paramount+": { slug: "paramountplus", color: "0064FF" },
    paramountplus: { slug: "paramountplus", color: "0064FF" },
    "star+": { slug: "starplus", color: "C724FF" },
    starplus: { slug: "starplus", color: "C724FF" },
    mubi: { slug: "mubi", color: "FFFFFF" },
    vercel: { slug: "vercel", color: "FFFFFF" },
    railway: { slug: "railway", color: "FFFFFF" },
    digitalocean: { slug: "digitalocean", color: "0080FF" },
    aws: { slug: "amazonaws", color: "FF9900" },
    azure: { slug: "microsoftazure", color: "0078D4" },
    heroku: { slug: "heroku", color: "430098" },
    cloudflare: { slug: "cloudflare", color: "F38020" },
  };

  // Si hay un alias conocido, usar ese slug y color
  const alias = aliases[normalized];
  if (alias) {
    return `https://cdn.simpleicons.org/${alias.slug}/${alias.color}`;
  }

  // Si no hay alias, intentar directamente con el nombre (sin espacios)
  // El CDN devolverá el icono si existe, o 404 si no
  return `https://cdn.simpleicons.org/${normalized}/FFFFFF`;
}

/**
 * Devuelve el color de marca (#hex) para un servicio conocido.
 * Si no se encuentra, devuelve el color por defecto (#6366f1 - indigo).
 */
export function getBrandColor(name: string): string {
  const DEFAULT_COLOR = "#6366f1";
  const normalized = name.toLowerCase().trim().replace(/\s+/g, "");
  if (!normalized) return DEFAULT_COLOR;

  const aliases: Record<string, string> = {
    netflix: "#E50914", spotify: "#1DB954", youtube: "#FF0000",
    youtubepremium: "#FF0000", youtubemusic: "#FF0000",
    disney: "#113CCF", "disney+": "#113CCF", disneyplus: "#113CCF",
    hbo: "#000000", hbomax: "#000000", max: "#002BE7",
    amazonprime: "#00A8E1", primevideo: "#00A8E1",
    appletv: "#000000", applemusic: "#FA243C", appleone: "#000000",
    crunchyroll: "#F47521", twitch: "#9146FF",
    github: "#181717", githubcopilot: "#181717", gitlab: "#FC6D26",
    figma: "#F24E1E", canva: "#00C4CC", notion: "#000000",
    slack: "#4A154B", zoom: "#0B5CFF",
    dropbox: "#0061FF", googleone: "#4285F4", googledrive: "#4285F4",
    icloud: "#3693F3", onedrive: "#0078D4",
    microsoft365: "#0078D4", office: "#0078D4",
    adobe: "#FF0000", photoshop: "#31A8FF", illustrator: "#FF9A00",
    creativecloud: "#DA1F26",
    chatgpt: "#10A37F", openai: "#10A37F", claude: "#D97757", cursor: "#000000",
    xboxgamepass: "#107C10", xbox: "#107C10",
    playstation: "#003791", psplus: "#003791",
    nintendo: "#E60012", steam: "#000000",
    duolingo: "#58CC02", linkedin: "#0A66C2", linkedinpremium: "#0A66C2",
    nordvpn: "#4687FF", expressvpn: "#DA3940",
    "1password": "#0094F5", bitwarden: "#175DDC", lastpass: "#D32D27",
    deezer: "#FEAA2D", tidal: "#000000",
    paramount: "#0064FF", "paramount+": "#0064FF", paramountplus: "#0064FF",
    "star+": "#C724FF", starplus: "#C724FF",
    mubi: "#000000", vercel: "#000000", railway: "#000000",
    digitalocean: "#0080FF", aws: "#FF9900", azure: "#0078D4",
    heroku: "#430098", cloudflare: "#F38020",
  };

  return aliases[normalized] || DEFAULT_COLOR;
}

/**
 * Alias de compatibilidad para código existente que usa findKnownLogo
 */
export function findKnownLogo(name: string): string | null {
  return getLogoUrl(name);
}
