# Restaurant Template — Astro + Decap CMS

Template de site restaurant prêt à déployer et personnaliser. 4 pages, bilingue FR/EN, CMS intégré.

**Stack :** Astro 5 · Tailwind CSS · Decap CMS · Netlify

---

## Pages incluses

| URL | Description |
|---|---|
| `/fr/` | Accueil — Hero, arguments, aperçu carte, galerie, chef, avis, horaires |
| `/fr/carte/` | La Carte — Tabs CSS-only (Entrées · Plats · Desserts · Fromages · Formules) |
| `/fr/equipe/` | L'Équipe — Profil chef, timeline, grille équipe, valeurs |
| `/fr/reservation/` | Réservation — Formulaire Netlify Forms + sidebar infos |

Chaque page existe aussi en `/en/`.

---

## Démarrage rapide

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # build de production
npm run check      # vérification TypeScript
```

---

## 1. Personnaliser les couleurs

**Un seul fichier à modifier : `src/styles/global.css`**

```css
:root {
  --primary:      26 26 24;     /* #1a1a18 — fond sombre, texte principal   */
  --secondary:    181 135 74;   /* #b5874a — accent doré, CTA               */
  --surface:      250 248 244;  /* #faf8f4 — fond clair principal            */
  --surface-alt:  242 237 229;  /* #f2ede5 — fond clair alternatif           */
  --surface-dark: 17 17 16;     /* #111110 — hero, sections très sombres     */
  --muted:        122 112 96;   /* #7a7060 — texte secondaire, labels        */
  --text-light:   245 240 232;  /* #f5f0e8 — texte sur fond sombre           */
  --border:       228 222 211;  /* #e4ded3 — bordures et séparateurs         */
}
```

`tailwind.config.mjs` n'a pas besoin d'être touché — il pointe automatiquement vers ces variables.

> **Format RGB sans virgules** (ex: `181 135 74` et non `#b5874a` ni `181, 135, 74`) — c'est ce format que Tailwind v3 requiert pour faire fonctionner les modificateurs d'opacité (`bg-secondary/50`, `border-primary/20`…).

---

## 2. Personnaliser les polices

Deux fichiers à modifier (les noms de polices sont en deux endroits car l'un charge la police, l'autre la déclare) :

### `src/styles/global.css` — déclarer les noms

```css
:root {
  --font-display: 'Cormorant Garamond'; /* titres, nav, labels    */
  --font-body:    'Jost';               /* corps de texte         */
}
```

### `src/layouts/BaseLayout.astro` — charger depuis Google Fonts

```html
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap"
  rel="stylesheet"
/>
```

Remplacer les deux noms dans ces deux fichiers. `tailwind.config.mjs` n'a pas besoin d'être touché.

> **Règle :** `font-display` s'applique aux titres (`h1`–`h6`) et aux éléments de mise en avant. `font-body` s'applique à tout le texte courant.

---

## 3. Personnaliser le contenu

### Via le CMS (recommandé)

Après déploiement, accéder à `/admin/` pour modifier :

- **Paramètres globaux** — nom, tagline, téléphone, email, adresse, horaires, réseaux sociaux
- **Page Accueil** — tous les textes, images, avis, galerie
- **La Carte** — tous les plats avec descriptions, prix et badges
- **L'Équipe** — profil chef, timeline, membres, valeurs
- **Réservation** — textes et options du formulaire

### Via les fichiers JSON (développement)

| Fichier | Contenu |
|---|---|
| `src/content/settings/index.json` | Infos globales du restaurant (non i18n) |
| `src/content/home/index.json` | Contenu de la page d'accueil (FR + EN) |
| `src/content/carte/index.json` | Plats, formules, prix (FR + EN) |
| `src/content/equipe/index.json` | Chef, équipe, valeurs (FR + EN) |
| `src/content/reservation/index.json` | Labels formulaire et options (FR + EN) |
| `src/content/ui/strings.json` | Chaînes d'interface (nav, boutons, badges…) |

Tous les JSONs de page suivent la structure :
```json
{
  "fr": { "titre": "Bonjour", "image": "/uploads/photo.jpg" },
  "en": { "titre": "Hello",   "image": "/uploads/photo.jpg" }
}
```

Les champs non traduits (images, URLs) peuvent être définis une seule fois — `getPageContent()` utilise `fr` comme fallback si la clé `en` est absente.

### Images

Toutes les images sont référencées par leur chemin `/uploads/nom.jpg`. Elles sont gérées via le CMS (téléversées dans `public/uploads/`). En production, elles passent automatiquement par le CDN Netlify Image pour être converties en WebP et redimensionnées.

---

## 4. URL du site

Deux fichiers à mettre à jour avec le vrai domaine :

**`astro.config.mjs`**
```js
site: 'https://mon-restaurant.netlify.app',
```

**`public/robots.txt`** — mettre à jour la ligne Sitemap :
```
Sitemap: https://mon-restaurant.netlify.app/sitemap-index.xml
```

> Ces deux fichiers ne sont **pas** mis à jour automatiquement.

---

## 5. Déploiement sur Netlify

1. Connecter le repo sur [netlify.com](https://netlify.com)
2. **Build command :** `npm run build` · **Publish directory :** `dist`
3. Activer **Netlify Identity** : Site settings → Identity → Enable
4. Activer **Git Gateway** : Identity → Services → Enable Git Gateway
5. Inviter l'utilisateur CMS : Identity → Invite users → envoyer l'email au client

Le CMS sera accessible sur `https://votre-domaine.com/admin/`.

---

## 6. Structure du projet

```
src/
├── components/
│   ├── Nav.astro               Header sticky + hamburger CSS-only
│   ├── Footer.astro            Pied de page avec horaires
│   ├── MobileReserveBar.astro  Barre fixe mobile (appeler / réserver)
│   ├── PageHero.astro          Hero réutilisable pour pages intérieures
│   ├── CtaBand.astro           Bandeau CTA réservation (toutes les pages)
│   ├── HeroSection.astro       Hero plein écran de la homepage
│   ├── HeroStrip.astro         Bandeau rapide (horaires, prix moyen…)
│   ├── ArgumentsSection.astro  4 arguments / engagements
│   ├── MenuPreviewSection.astro Aperçu de la carte sur la homepage
│   ├── GallerySection.astro    Grille galerie 7 photos
│   ├── ChefPreviewSection.astro Photo + citation du chef
│   ├── ReviewsSection.astro    3 avis clients avec étoiles
│   ├── HoursSection.astro      Tableau horaires + contact
│   ├── CarteSection.astro      Tabs CSS-only pour la page carte
│   ├── ChefProfileSection.astro Profil complet du chef
│   ├── ChefTimelineSection.astro Parcours chronologique
│   ├── TeamGridSection.astro   Grille membres de l'équipe
│   ├── ValuesSection.astro     3 valeurs du restaurant
│   └── ReservationSection.astro Formulaire + sidebar infos
├── content/
│   ├── home/index.json
│   ├── carte/index.json
│   ├── equipe/index.json
│   ├── reservation/index.json
│   ├── settings/index.json
│   └── ui/strings.json
├── layouts/
│   └── BaseLayout.astro        Shell HTML (SEO, fonts, JSON-LD, Netlify Identity)
├── pages/
│   ├── index.astro             Redirect racine → /fr/
│   └── [locale]/
│       ├── index.astro         Accueil
│       ├── carte.astro         La Carte
│       ├── equipe.astro        L'Équipe
│       └── reservation.astro   Réservation
├── styles/
│   └── global.css              Variables CSS + animations fade-up
└── utils/
    ├── i18n.ts                 getPageContent(), getTranslator(), getAlternateUrl()
    └── image.ts                netlifyImg(), netlifyImgH()
public/
├── admin/
│   ├── config.yml              Configuration Decap CMS
│   └── index.html              Interface CMS
└── uploads/                    Images gérées par le CMS
```

---

## 7. Ajouter une nouvelle section

1. **Schéma** — ajouter les champs dans `src/content.config.mjs` (collection existante ou nouvelle)
2. **JSON** — ajouter les valeurs FR/EN dans le fichier `src/content/<page>/index.json`
3. **Composant** — créer `src/components/MaSection.astro`
4. **Page** — importer le composant dans `src/pages/[locale]/<page>.astro`
5. **CMS** — ajouter les champs dans `public/admin/config.yml`
6. **i18n.ts** — si nouvelle collection : ajouter le type + l'overload de `getPageContent`

---

## 8. Formulaire de réservation

Le formulaire utilise **Netlify Forms** (gratuit, sans backend). Il fonctionne automatiquement après déploiement sur Netlify.

Les soumissions sont visibles dans : Netlify dashboard → Forms → `reservation`.

Pour recevoir les réservations par email : Forms → Notifications → Add notification → Email.

---

## Commandes

```bash
npm run dev      # Serveur de développement (localhost:4321)
npm run build    # Build de production → dist/
npm run preview  # Prévisualiser le build
npm run check    # Vérification TypeScript (doit afficher 0 erreur)
```
