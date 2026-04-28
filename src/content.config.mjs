import { defineCollection, z } from 'astro:content';

// ─── Schéma commun pour les métadonnées de page ───────────────────────────────
const pageMeta = z.object({
  meta_title:       z.string(),
  meta_description: z.string(),
});

// ─── home ────────────────────────────────────────────────────────────────────
const homeLocale = pageMeta.extend({
  strip_open_label:    z.string(),
  strip_open_value:    z.string(),
  strip_service_label: z.string(),
  strip_service_value: z.string(),
  strip_book_label:    z.string(),
  strip_book_value:    z.string(),
  strip_price_label:   z.string(),
  strip_price_value:   z.string(),
  arguments: z.array(z.object({
    icon:        z.string(),
    title:       z.string(),
    description: z.string(),
  })),
  menu_preview_starters: z.array(z.object({ name: z.string(), price: z.string() })),
  menu_preview_mains:    z.array(z.object({ name: z.string(), price: z.string() })),
  menu_preview_desserts: z.array(z.object({ name: z.string(), price: z.string() })),
  menu_preview_formulas: z.array(z.object({ name: z.string(), price: z.string() })),
  gallery_images: z.array(z.object({
    src:     z.string(),
    alt:     z.string(),
    variant: z.enum(['normal', 'tall', 'wide']).optional(),
  })),
  reviews: z.array(z.object({
    author:  z.string(),
    date:    z.string(),
    rating:  z.number().min(1).max(5),
    comment: z.string(),
  })),
});

const home = defineCollection({
  type: 'data',
  schema: z.record(z.string(), homeLocale),
});

// ─── carte ────────────────────────────────────────────────────────────────────
const menuItem = z.object({
  name:        z.string(),
  description: z.string().optional(),
  price:       z.string(),
  badges:      z.array(z.enum(['signature', 'vege', 'new', 'gluten', 'maison'])).optional(),
});

const formula = z.object({
  name:     z.string(),
  price:    z.string(),
  includes: z.array(z.string()),
  note:     z.string().optional(),
});

const carteLocale = pageMeta.extend({
  hero_title:    z.string(),
  hero_subtitle: z.string().optional(),
  entrees:       z.array(menuItem),
  plats:         z.array(menuItem),
  desserts:      z.array(menuItem),
  fromages:      z.array(menuItem),
  formules:      z.array(formula),
  cta_title:     z.string(),
  cta_button:    z.string(),
});

const carte = defineCollection({
  type: 'data',
  schema: z.record(z.string(), carteLocale),
});

// ─── equipe ───────────────────────────────────────────────────────────────────
const timelineItem = z.object({
  year:        z.string(),
  title:       z.string(),
  description: z.string(),
});

const teamMember = z.object({
  name:  z.string(),
  role:  z.string(),
  image: z.string().optional(),
});

const value = z.object({
  icon:        z.string(),
  title:       z.string(),
  description: z.string(),
});

const equipeLocale = pageMeta.extend({
  hero_title:        z.string(),
  // Toujours affichés
  story_title:       z.string().optional(),
  story_description: z.string().optional(),
  story_image:       z.string().optional(),
  values_title:      z.string(),
  values:            z.array(value),
  team_title:        z.string(),
  team:              z.array(teamMember),
  cta_title:         z.string(),
  cta_button:        z.string(),
  // Mode chef uniquement (siteConfig.chef === true)
  chef_name:         z.string().optional(),
  chef_role:         z.string().optional(),
  chef_description:  z.string().optional(),
  chef_image:        z.string().optional(),
  timeline_title:    z.string().optional(),
  timeline:          z.array(timelineItem).optional(),
});

const histoire = defineCollection({
  type: 'data',
  schema: z.record(z.string(), equipeLocale),
});

// ─── reservation ──────────────────────────────────────────────────────────────
const reservationLocale = pageMeta.extend({
  hero_title:         z.string(),
  hero_subtitle:      z.string().optional(),
  form_title:         z.string(),
  form_firstname:     z.string(),
  form_lastname:      z.string(),
  form_email:         z.string(),
  form_phone:         z.string(),
  form_date:          z.string(),
  form_service:       z.string(),
  form_guests:        z.string(),
  form_formula:       z.string(),
  form_message:       z.string(),
  form_submit:        z.string(),
  form_success:       z.string(),
  form_error:         z.string(),
  form_rgpd:          z.string(),
  services: z.array(z.object({ label: z.string(), value: z.string() })),
  formulas: z.array(z.object({ label: z.string(), value: z.string() })),
  info_phone_title:   z.string(),
  info_hours_title:   z.string(),
  info_address_title: z.string(),
  info_groups_title:  z.string(),
  info_groups_text:   z.string(),
});

const reservation = defineCollection({
  type: 'data',
  schema: z.record(z.string(), reservationLocale),
});

// ─── brand ───────────────────────────────────────────────────────────────────
// Textes d'identité bilingues (site_name, hero, chef…)
const brandTexts = z.object({
  site_name:         z.string().optional(),
  tagline:           z.string().optional(),
  restaurant_type:   z.string().optional(),
  meta_description:  z.string().optional(),
  hero_title:        z.string().optional(),
  hero_subtitle:     z.string().optional(),
  hero_cta:          z.string().optional(),
  about_tagline:     z.string().optional(),
  about_description: z.string().optional(),
  menu_file:         z.string().optional(),
});

const brand = defineCollection({
  type: 'data',
  schema: z.object({
    // Faits (pas de traduction)
    phone:          z.string().optional(),
    email:          z.string().optional(),
    street_address: z.string().optional(),
    city:           z.string().optional(),
    postal_code:    z.string().optional(),
    country:        z.string().optional(),
    maps_url:       z.string().optional(),
    logo:           z.string().optional(),
    og_image:       z.string().optional(),
    twitter_handle: z.string().optional(),
    instagram_url:  z.string().optional(),
    facebook_url:   z.string().optional(),
    youtube_url:    z.string().optional(),
    hero_image:     z.string().optional(),
    about_image:    z.string().optional(),
    hours: z.array(z.object({
      days:   z.string(),
      lunch:  z.string().optional(),
      dinner: z.string().optional(),
    })).optional(),
    // Textes bilingues
    fr: brandTexts.optional(),
    en: brandTexts.optional(),
  }),
});

// ─── ui ──────────────────────────────────────────────────────────────────────
const ui = defineCollection({
  type: 'data',
  schema: z.record(z.string(), z.record(z.string(), z.string())),
});

// ─── mentions légales ─────────────────────────────────────────────────────────
const mentionsLocale = z.record(z.string(), z.string());

const mentions = defineCollection({
  type: 'data',
  schema: z.object({
    developer: z.object({
      name:         z.string(),
      legal_form:   z.string(),
      siret:        z.string(),
      address:      z.string(),
      email:        z.string(),
    }),
    fr: mentionsLocale.optional(),
    en: mentionsLocale.optional(),
  }),
});

export const collections = { home, carte, histoire, reservation, brand, ui, mentions };
