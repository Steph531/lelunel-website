import { getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { siteConfig } from '../siteConfig';

export const DEFAULT_LOCALE = 'fr';

export type Locale = string;
export type PageName = 'home' | 'carte' | 'histoire' | 'reservation';

// Types dérivés automatiquement des schémas Zod définis dans content.config.mjs.
export type HomeContent        = CollectionEntry<'home'>['data'][string];
export type CarteContent       = CollectionEntry<'carte'>['data'][string];
export type HistoireContent    = CollectionEntry<'histoire'>['data'][string];
export type ReservationContent = CollectionEntry<'reservation'>['data'][string];

// Types pour la config de marque
type BrandEntry = CollectionEntry<'brand'>['data'];
type BrandTexts = NonNullable<BrandEntry['fr']>;
export type BrandContent = Omit<BrandEntry, 'fr' | 'en'> & Partial<BrandTexts>;

export async function getPageContent(page: 'home',        locale: string): Promise<HomeContent>;
export async function getPageContent(page: 'carte',       locale: string): Promise<CarteContent>;
export async function getPageContent(page: 'histoire',    locale: string): Promise<HistoireContent>;
export async function getPageContent(page: 'reservation', locale: string): Promise<ReservationContent>;
export async function getPageContent(page: PageName,      locale: string): Promise<Record<string, unknown>>;
export async function getPageContent(page: PageName, locale: string) {
  const entry = await getEntry(page, 'index');
  if (!entry) throw new Error(`Contenu introuvable : ${page}/index`);
  const data = entry.data;
  return data[locale] ?? data[DEFAULT_LOCALE];
}

/**
 * Retourne la config de marque fusionnée : faits (phone, hours…) + textes localisés (site_name, hero…).
 *
 * Exemple :
 *   const brand = await getBrand(locale);
 *   brand.phone       // "+33 1 42 00 00 00"
 *   brand.hero_title  // "Une cuisine sincère..." (selon la locale)
 */
export async function getBrand(locale: string): Promise<BrandContent> {
  const entry = await getEntry('brand', 'index');
  if (!entry) return {} as BrandContent;
  const { fr, en, ...facts } = entry.data;
  const texts: Partial<BrandTexts> = (locale === 'en' ? en : fr) ?? fr ?? en ?? {};
  return { ...facts, ...texts } as BrandContent;
}

/**
 * Charge les traductions UI une seule fois et retourne une fonction t() synchrone.
 *
 * Exemple :
 *   const t = await getTranslator(locale);
 *   t('nav.home') // synchrone, pas d'await
 */
export async function getTranslator(locale: string): Promise<(key: string) => string> {
  const entry = await getEntry('ui', 'strings');
  const strings = entry?.data ?? {};
  return (key: string) => strings[locale]?.[key] ?? strings['fr']?.[key] ?? key;
}

/**
 * Retourne l'URL embed pour une vidéo YouTube ou Vimeo.
 */
export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}

/**
 * Génère un chemin avec ou sans préfixe locale selon siteConfig.multilanguage.
 * Ex : localePath('fr', '/carte/') → '/fr/carte/' (multilanguage: true) ou '/carte/' (false)
 */
export function localePath(locale: string, path: string): string {
  return siteConfig.multilanguage ? `/${locale}${path}` : path;
}

/**
 * Retourne l'URL de la page alternative pour le sélecteur de langue.
 * Ex : /fr/carte/ → /en/carte/
 */
export function getAlternateUrl(currentPath: string, targetLocale: string): string {
  const parts = currentPath.split('/').filter(Boolean);
  if (parts.length === 0) return `/${targetLocale}/`;
  parts[0] = targetLocale;
  return `/${parts.join('/')}/`;
}
