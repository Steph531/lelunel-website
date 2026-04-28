/**
 * Returns a Netlify Image CDN URL sized by WIDTH, or the original src in dev.
 * @param src   Absolute path e.g. /uploads/photo.jpg
 * @param width Target width in pixels
 */
export function netlifyImg(src: string, width: number): string {
  if (!src || !src.startsWith('/')) return src;
  if (import.meta.env.DEV) return src;
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=webp`;
}

/**
 * Returns a Netlify Image CDN URL sized by HEIGHT (for fixed-height images).
 * Use with 1x/2x srcset descriptors instead of width-based srcset.
 * @param src    Absolute path e.g. /uploads/photo.jpg
 * @param height Target height in pixels (for 1x screens)
 */
export function netlifyImgH(src: string, height: number): string {
  if (!src || !src.startsWith('/')) return src;
  if (import.meta.env.DEV) return src;
  return `/.netlify/images?url=${encodeURIComponent(src)}&h=${height}&fm=webp`;
}
