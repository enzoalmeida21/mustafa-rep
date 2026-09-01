export function siteUrl(path = "") {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mustafarep.com"
  ).replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${base}${suffix}`;
}
