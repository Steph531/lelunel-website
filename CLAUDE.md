# CLAUDE.md — Lau Vigu Website Conventions

## Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS v3 + custom CSS in `<style>` blocks for animations
- **CMS:** Decap CMS at `/admin/` (Netlify Identity + Git Gateway)
- **Deployment:** Netlify (image CDN, forms, identity)
- **Fonts:** Unbounded (display/headings) + DM Sans (body) — loaded via Google Fonts CDN in `BaseLayout.astro`

## Locales

- **Default:** `fr` (English)
- **Available:** `en`, `fr`
- **Fallback chain:** `fr → en`
- **URL pattern:** `/en/`, `/fr/` (all prefixed, no root redirect)
- **Root `index.astro`** does a client-side JS redirect to `/en/` to preserve Netlify Identity hash tokens

## Content Rules

### No hardcoded text in templates — ever

All user-visible text must come from content collections via `getPageContent()` or UI strings via `getTranslator()`.

```ts
// ✅ Correct
const content = await getPageContent('about', locale);
<h2>{content.title}</h2>

// ❌ Wrong — never hardcode
<h2>About me</h2>
```

### Adding content to a new or existing section

1. Add fields to the Zod schema in `src/content.config.mjs`
2. Add the field with values for `en`, `fr` in the JSON file (`src/content/<page>/index.json`)
3. Add the field to the CMS collection in `public/admin/config.yml` with `i18n: true`
4. Use the field in the component via `content.field_name`

### Content collection structure

All collections use a locale-keyed JSON structure:

```json
{
  "en": { "field": "value" },
  "fr": { "field": "valeur" }
}
```

### `getPageContent(page, locale)`

Located in `src/utils/i18n.ts`. Returns the typed data for the locale, falls back to `fr` if the locale key is missing.

```ts
const content = await getPageContent("home", locale);
// Returns: HomeContent (typed)
```

When adding a new page collection:

- Add the type to `PageName` union in `i18n.ts`
- Add a typed export (e.g. `export type NewContent = CollectionEntry<'new'>['data'][string]`)
- Add a typed overload of `getPageContent`

### `getTranslator(locale)`

Returns a synchronous `t(key)` function for UI strings stored in `src/content/ui/strings.json`.

```ts
const t = await getTranslator(locale);
t("nav.home"); // → "Home" | "Accueil" | "Inicio"
```

## Images

**All images must use `netlifyImg()` or `netlifyImgH()`** from `src/utils/image.ts`.

```astro
import { netlifyImg, netlifyImgH } from '../utils/image';

// By width (most cases)
<img src={netlifyImg('/uploads/photo.jpg', 800)} alt="..." />

// By height (fixed-height layouts)
<img src={netlifyImgH('/uploads/photo.jpg', 400)} alt="..." />
```

- In dev: returns the original path unchanged
- In production (Netlify): returns the CDN URL with `webp` format
- Images are uploaded via Decap CMS to `public/uploads/` → served as `/uploads/`

Never use raw `<img src="/uploads/..." />` without the utility.

## Videos

Use the existing `VideoEmbed.astro` component with `getVideoEmbedUrl()`:

```ts
import VideoEmbed from "../components/VideoEmbed.astro";
import { getVideoEmbedUrl } from "../utils/i18n";

const embedUrl = videoUrl ? getVideoEmbedUrl(videoUrl) : null;
```

```astro
{embedUrl && <VideoEmbed url={embedUrl} title="..." />}
```

`getVideoEmbedUrl()` supports YouTube (youtu.be, youtube.com/watch) and Vimeo URLs.
Video URLs are stored in `src/content/settings/index.json` (not i18n — same video for all locales).

## Navigation & Page Structure

The site is a **single-page layout** with anchor sections. All sections live on one Astro page per locale (`/en/`, `/fr/`, `/es/`).

### Anchor navigation (no JS show/hide)

- Sections have `id="sectionname"` + `scroll-mt-[70px]` for the fixed nav offset
- Nav links use `href="/{locale}/#sectionname"` anchors
- `html { scroll-behavior: smooth; }` handles the smooth scroll (set in `BaseLayout`)

### Section IDs

- `#accueil` — Hero
- `#about` — About
- `#acting` — Acting
- `#chant` — Singing/Chant
- `#contact` — Contact

### Active nav state

`Nav.astro` uses an `IntersectionObserver` in a `<script is:inline>` block. No framework, no hydration.

## CSS & Styling

### Tailwind en priorité absolue

**Toujours utiliser Tailwind** pour : layout, spacing, couleurs, typographie, border, shadow, hover, focus, transitions, responsive. Cela inclut les valeurs arbitraires (`text-[0.55rem]`, `tracking-[0.18em]`, `shadow-[4px_4px_0_var(--dark)]`) et les pseudo-classes (`hover:`, `focus:`, `placeholder:`, `before:`, `after:`).

### CSS dans `<style>` uniquement si Tailwind ne peut pas l'exprimer

Les seuls cas légitimes pour un bloc `<style>` sont :

- **`@keyframes`** — animations nommées (blobMorph, float, spin, marquee, checkerScroll, fadeIn…)
- **Sélecteurs `:checked ~`** — pour le système de tabs CSS-only (ChantSection)
- **`-webkit-text-stroke`** — propriété non couverte par Tailwind (ghost text Hero)
- **`::before` / `::after` avec `content`** si le pseudo-élément est trop complexe pour les préfixes `before:` de Tailwind (ex: gradient line de la CV timeline)

```css
/* ✅ Légitime en CSS */
@keyframes blobMorph { ... }
#tab-covers:checked ~ .tab-panels .panel-covers { display: block; }
.ghost-text { -webkit-text-stroke: 2px rgba(...); }

/* ❌ À mettre en Tailwind */
.section-tag { font-family: ...; color: ...; padding: ...; } /* → classes inline */
.btn { background: ...; border-radius: ...; } /* → classes inline */
```

### CSS-only tabs (no JS)

Use the radio input + label pattern for tab components:

```html
<input type="radio" id="tab-1" name="group" class="sr-only" checked />
<input type="radio" id="tab-2" name="group" class="sr-only" />

<div class="tabs-bar">
  <label for="tab-1" class="tab-btn">Tab 1</label>
  <label for="tab-2" class="tab-btn">Tab 2</label>
</div>

<div class="tab-panels">
  <div class="panel-1">...</div>
  <div class="panel-2">...</div>
</div>
```

```css
#tab-1:checked ~ .tab-panels .panel-1 {
  display: block;
}
#tab-2:checked ~ .tab-panels .panel-2 {
  display: block;
}
.tab-panels > div {
  display: none;
}
```

### Brand colors (Tailwind classes)

| Class                                 | Hex       | Usage                               |
| ------------------------------------- | --------- | ----------------------------------- |
| `bg-lime` / `text-lime`               | `#BFED6E` | Primary CTA, accents, active states |
| `bg-violet` / `text-violet`           | `#9B7FE8` | Nav, buttons, quote blocks          |
| `bg-violet-light`                     | `#C8B4F5` | Acting section background           |
| `bg-violet-deep` / `text-violet-deep` | `#7A5CC8` | Hover states, shadows               |
| `bg-cream` / `text-cream`             | `#FFFBE6` | Main background, text on dark       |
| `bg-dark` / `text-dark`               | `#2D2250` | Primary text, dark sections         |

Available as CSS variables too: `var(--lime)`, `var(--violet)`, etc. (defined in `src/styles/global.css`).

### Font classes

- `font-display` → Unbounded (headings, labels, buttons, nav)
- `font-body` → DM Sans (paragraphs, descriptions)

## Netlify Forms

Contact forms must include:

1. `data-netlify="true"` on the `<form>` tag
2. `name="contact"` on the `<form>` tag
3. A hidden input: `<input type="hidden" name="form-name" value="contact" />`
4. `method="POST"` on the `<form>` tag

```html
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  ...
</form>
```

## Mobile-First

All layouts are mobile-first. Use Tailwind responsive prefixes:

- `grid-cols-1` default → `sm:grid-cols-2` → `lg:grid-cols-3`
- Font sizes use `clamp()` for fluid scaling (set in CSS)
- Nav collapses to hamburger on mobile (CSS-only checkbox trick in `Nav.astro`)

## Adding a New Section

1. **Content schema:** Add a collection to `src/content.config.mjs`
2. **Content JSON:** Create `src/content/<name>/index.json` with `en`, `fr` keys
3. **i18n.ts:** Add to `PageName` union + typed export + typed `getPageContent` overload
4. **Component:** Create `src/components/<Name>Section.astro`
5. **Page:** Import and render in `src/pages/[locale]/index.astro`
6. **CMS:** Add collection to `public/admin/config.yml`

## Dev Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build static site to dist/
npm run preview  # Preview built site locally
npm run check    # Astro + TypeScript type checking
```

## File Structure

```
src/
  components/       # Astro components (Nav, Hero, sections, Footer, VideoEmbed)
  content/          # JSON content per collection
    home/index.json
    about/index.json
    acting/index.json
    chant/index.json
    contact/index.json
    settings/index.json
    ui/strings.json
  content.config.mjs  # Zod schemas for all collections
  layouts/
    BaseLayout.astro  # HTML shell (head, body, Google Fonts, Netlify Identity)
  pages/
    index.astro       # Root redirect to /en/
    [locale]/
      index.astro     # Main page (en/fr/es) — imports all components
  styles/
    global.css        # Tailwind directives + CSS variables + base font styles
  utils/
    i18n.ts           # getPageContent, getTranslator, getVideoEmbedUrl
    image.ts          # netlifyImg, netlifyImgH
public/
  admin/
    config.yml        # Decap CMS configuration
    index.html        # CMS interface
  uploads/            # CMS-managed image uploads
```
