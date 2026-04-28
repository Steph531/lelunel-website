import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import fs from "node:fs";
import { siteConfig } from "./src/siteConfig.ts";

// Génère dist/_redirects pour les URLs sans préfixe locale quand multilanguage: false
const netlifyRedirects = {
  name: "netlify-redirects",
  hooks: {
    "astro:build:done": ({ dir }) => {
      if (!siteConfig.multilanguage) {
        fs.writeFileSync(
          new URL("_redirects", dir),
          [
            "/admin/*   /admin/:splat  200",
            "/_astro/*  /_astro/:splat 200",
            "/uploads/* /uploads/:splat 200",
            "/fr/*      /:splat        301",
            "/*         /fr/:splat     200!",
            "",
          ].join("\n"),
        );
      }
    },
  },
};

// En mode monolangue, redirige les chemins sans préfixe vers /fr/...
// → fonctionne en dev (301) et preview (HTML redirect)
// → en prod Netlify, le fichier _redirects avec 200! prend le dessus (rewrite transparent)
const localeRedirects = !siteConfig.multilanguage
  ? {
      "/carte/": "/fr/carte/",
      "/reservation/": "/fr/reservation/",
      "/histoire/": "/fr/histoire/",
      "/mentions-legales/": "/fr/mentions-legales/",
    }
  : {};

export default defineConfig({
  site: process.env.URL || "http://localhost:4321",
  redirects: localeRedirects,
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes("/admin/"),
      ...(siteConfig.multilanguage
        ? {
            i18n: {
              defaultLocale: "fr",
              locales: {
                fr: "fr-FR",
                en: "en-US",
              },
            },
          }
        : {}),
    }),
    netlifyRedirects,
  ],
  output: "static",
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false, // On gère le redirect manuellement dans src/pages/index.astro
    },
    fallback: {
      en: "fr",
    },
  },
});
