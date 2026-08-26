import type { Industry } from "./types";

type ArtIndustry = Pick<Industry, "slug" | "accentColor" | "logoImage" | "coverImage">;

const WHITE_LOGO_SLUGS = new Set(["h2o"]);

export function industryArt(industry: ArtIndustry) {
  const src = industry.logoImage ?? industry.coverImage ?? null;
  const isMark = Boolean(src?.endsWith(".png"));
  const onWhite = WHITE_LOGO_SLUGS.has(industry.slug);

  return {
    src,
    isMark,
    background: isMark ? (onWhite ? "#ffffff" : industry.accentColor) : undefined,
  };
}
