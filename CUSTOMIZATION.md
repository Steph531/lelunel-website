# Guide de personnalisation

Checklist pour adapter ce template à un nouveau projet.

---

## 1. Couleurs (obligatoire)

**`tailwind.config.mjs`** — les 3 tokens de marque :

| Token | Rôle | Valeur par défaut |
|---|---|---|
| `brand-bg` | Fond principal | `#0F0F0F` (sombre) |
| `brand-accent` | Couleur d'accent, CTA | `#E5B65B` (or) |
| `brand-muted` | Texte secondaire | `#AAAAAA` (gris) |

**`src/styles/global.css`** — synchroniser les mêmes valeurs dans `:root` :

```css
:root {
  --brand-bg:     #0F0F0F;
  --brand-accent: #E5B65B;
  --brand-muted:  #AAAAAA;
  --brand-bg-rgb:     15, 15, 15;
  --brand-accent-rgb: 229, 182, 91;
}
```

---

## 2. Typographie (optionnel)

**`tailwind.config.mjs`** — changer les familles de polices :

```js
fontFamily: {
  serif: ['"Playfair Display"', ...],  // titres
  sans:  ['Montserrat', ...],          // corps
},
```

**`src/layouts/BaseLayout.astro`** — importer la nouvelle police `@fontsource/...`

---

## 3. URL du site

**`astro.config.mjs`** :

```js
site: 'https://votre-domaine.netlify.app',
```

---

## 4. Contenu via le CMS

Accéder à `/admin/` après déploiement et renseigner :

- **Paramètres globaux** : logo, réseaux sociaux
- **Page Accueil** : méta-titre et description SEO

---

## 5. Ajouter une page

1. Créer `src/pages/[locale]/ma-page.astro`
2. Créer `src/content/ma-page/index.json` avec les champs i18n
3. Ajouter une collection dans `public/admin/config.yml`

---

## 6. i18n — modifier les langues

**`astro.config.mjs`** :

```js
i18n: {
  defaultLocale: 'fr',
  locales: ['fr', 'en'],  // ajouter/retirer des langues ici
}
```

**`public/admin/config.yml`** :

```yaml
i18n:
  locales: [fr, en]
  default_locale: fr
```

---

## 7. Fichiers à ne pas modifier entre projets

- `src/utils/i18n.ts`
- `src/utils/image.ts`
- `netlify.toml`
- `tsconfig.json`
