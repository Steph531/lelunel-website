#!/usr/bin/env node
/**
 * Script de configuration du starter — à lancer une seule fois après clonage.
 * Pose 2 questions et retire les features non désirées.
 * Se supprime lui-même à la fin.
 */

import { createInterface } from 'readline';
import { readFileSync, writeFileSync, rmSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const root = join(dirname(__filename), '..');

// ─── Helpers ────────────────────────────────────────────────────────────────

function read(rel) {
  return readFileSync(join(root, rel), 'utf-8');
}

function write(rel, content) {
  writeFileSync(join(root, rel), content, 'utf-8');
}

function remove(rel) {
  const p = join(root, rel);
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
}

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim().toLowerCase())));
}

// ─── Transformations CMS ────────────────────────────────────────────────────

function removeCms(withI18n) {
  console.log('\n→ Suppression du CMS...');

  // 1. Supprimer public/admin/
  remove('public/admin');
  console.log('  ✓ public/admin/ supprimé');

  // 2. BaseLayout.astro — retirer isProd + 2 blocs Netlify Identity
  let layout = read('src/layouts/BaseLayout.astro');
  layout = layout
    .replace(/\n\nconst isProd = import\.meta\.env\.PROD;\n/, '\n')
    .replace(/\n  <!-- Netlify Identity Widget[^]*?<\/script>\n/, '\n')
    .replace(/\n  <!--\n    Après une connexion[^]*?<\/script>\n/, '\n');
  write('src/layouts/BaseLayout.astro', layout);
  console.log('  ✓ BaseLayout.astro — Netlify Identity retiré');

  // 3. netlify.toml — retirer blocs admin + uploads + identity.netlify.com du CSP
  let toml = read('netlify.toml');
  // Retirer identity.netlify.com du CSP global
  toml = toml.replace(/ https:\/\/identity\.netlify\.com/g, '');
  // Retirer bloc [[headers]] for = "/admin/*"
  toml = toml.replace(/\n# Sécurité[^\n]*\n\[\[headers\]\]\n  for = "\/admin\/\*"[^]*?\n(?=\n#|\n\[\[)/, '\n');
  // Retirer bloc [[headers]] for = "/uploads/*"
  toml = toml.replace(/\n# Cache long pour les images[^\n]*\n\[\[headers\]\]\n  for = "\/uploads\/\*"[^]*$/, '\n');
  write('netlify.toml', toml.trimEnd() + '\n');
  console.log('  ✓ netlify.toml — headers admin/uploads + CSP identity retirés');

  // 4. Réécrire src/pages/index.astro
  if (withI18n) {
    // Simple redirect vers la locale par défaut
    write('src/pages/index.astro', [
      '---',
      '---',
      '<script>window.location.replace(\'/fr/\');</script>',
      '',
    ].join('\n'));
  } else {
    // Page d'accueil directe (i18n aussi retiré, traité dans removeI18n)
    // Sera réécrit par removeI18n — rien à faire ici
  }
  if (withI18n) console.log('  ✓ src/pages/index.astro — redirect simple (sans token CMS)');
}

// ─── Transformations i18n ────────────────────────────────────────────────────

function removeI18n(withCms) {
  console.log('\n→ Suppression de l\'i18n...');

  // 1. Supprimer src/pages/[locale]/
  remove('src/pages/[locale]');
  console.log('  ✓ src/pages/[locale]/ supprimé');

  // 2. Simplifier src/utils/i18n.ts (sans locale)
  write('src/utils/i18n.ts', [
    "import { getEntry } from 'astro:content';",
    "import type { CollectionEntry } from 'astro:content';",
    '',
    "export type PageName = 'home';",
    '',
    '// Types dérivés automatiquement des schémas Zod définis dans content.config.mjs.',
    "export type HomeContent = CollectionEntry<'home'>['data'];",
    '',
    '// Pour ajouter une page : ajouter son type ici + une surcharge de getPageContent',
    "// export type AboutContent = CollectionEntry<'about'>['data'];",
    '',
    "export async function getPageContent(page: 'home'): Promise<HomeContent>;",
    'export async function getPageContent(page: PageName): Promise<Record<string, unknown>>;',
    'export async function getPageContent(page: PageName) {',
    "  const entry = await getEntry(page, 'index');",
    '  if (!entry) throw new Error(`Contenu introuvable : ${page}/index`);',
    '  return entry.data;',
    '}',
    '',
  ].join('\n'));
  console.log('  ✓ src/utils/i18n.ts — simplifié (sans locale)');

  // 3. Supprimer src/content/ui/strings.json
  remove('src/content/ui');
  console.log('  ✓ src/content/ui/ supprimé');

  // 4. astro.config.mjs — retirer le bloc i18n
  let config = read('astro.config.mjs');
  config = config.replace(/,\n  \/\/ i18n[^\n]*\n  i18n: \{[^}]*(?:\{[^}]*\}[^}]*)*\},/, ',');
  // Nettoyage virgule finale avant })
  config = config.replace(/,\n\}\);/, '\n});');
  write('astro.config.mjs', config);
  console.log('  ✓ astro.config.mjs — bloc i18n retiré');

  // 5. Aplatir src/content/home/index.json (prendre les valeurs fr par défaut)
  const home = JSON.parse(read('src/content/home/index.json'));
  const flat = home['fr'] ?? home['en'] ?? Object.values(home)[0];
  write('src/content/home/index.json', JSON.stringify(flat, null, 2) + '\n');
  console.log('  ✓ src/content/home/index.json — aplati (locale fr)');

  // 6. Mettre à jour src/content.config.mjs — schéma home aplati + retirer collection ui
  write('src/content.config.mjs', [
    "import { defineCollection, z } from 'astro:content';",
    '',
    '// ─── home ────────────────────────────────────────────────────────────────────',
    'const home = defineCollection({',
    "  type: 'data',",
    '  schema: z.object({',
    '    meta_title: z.string(),',
    '    meta_description: z.string(),',
    '  }),',
    '});',
    '',
    '// ─── settings ────────────────────────────────────────────────────────────────',
    'const settings = defineCollection({',
    "  type: 'data',",
    '  schema: z.object({',
    '    logo: z.string().optional(),',
    '    instagram_url: z.string().optional(),',
    '    linkedin_url: z.string().optional(),',
    '    youtube_url: z.string().optional(),',
    '  }),',
    '});',
    '',
    'export const collections = { home, settings };',
    '',
  ].join('\n'));
  console.log('  ✓ src/content.config.mjs — schéma home aplati, collection ui retirée');

  // 7. Réécrire src/pages/index.astro comme page d'accueil directe
  write('src/pages/index.astro', [
    '---',
    "import BaseLayout from '../layouts/BaseLayout.astro';",
    "import { getPageContent } from '../utils/i18n';",
    '',
    "const content = await getPageContent('home');",
    '---',
    '',
    '<BaseLayout',
    '  title={content.meta_title}',
    '  description={content.meta_description}',
    '  lang="fr"',
    '  currentPath={Astro.url.pathname}',
    '>',
    '  <h1>{content.meta_title}</h1>',
    '</BaseLayout>',
    '',
  ].join('\n'));
  console.log("  ✓ src/pages/index.astro — page d'accueil directe (getPageContent)");

  // 8. Si CMS gardé : simplifier public/admin/config.yml (retirer i18n)
  if (withCms) {
    let cms = read('public/admin/config.yml');
    // Retirer le bloc i18n global
    cms = cms.replace(/\ni18n:\n  structure:[^\n]*\n  locales:[^\n]*\n  default_locale:[^\n]*\n/, '\n');
    // Retirer les lignes "  i18n: true"
    cms = cms.replace(/\n    i18n: true/g, '');
    // Retirer les lignes "  i18n: true" (collection level)
    cms = cms.replace(/\n  i18n: true/g, '');
    write('public/admin/config.yml', cms);
    console.log('  ✓ public/admin/config.yml — config i18n retirée');
  }
}

// ─── Nettoyage final ─────────────────────────────────────────────────────────

function cleanup() {
  // Retirer le script "setup" de package.json
  const pkg = JSON.parse(read('package.json'));
  delete pkg.scripts.setup;
  write('package.json', JSON.stringify(pkg, null, 2) + '\n');
  console.log('\n→ package.json — script "setup" retiré');

  // Supprimer ce script
  unlinkSync(__filename);
  console.log('→ scripts/setup.mjs — auto-supprimé');

  // Supprimer le dossier scripts/ s'il est vide
  try {
    rmSync(join(root, 'scripts'), { recursive: true, force: true });
  } catch {}
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n╔════════════════════════════════╗');
  console.log('║   astro-cms-starter — Setup    ║');
  console.log('╚════════════════════════════════╝\n');

  const wantCms  = (await ask(rl, '? CMS (Decap CMS + Netlify Identity) ? [o/n] ')) === 'o';
  const wantI18n = (await ask(rl, '? Multi-langue (i18n fr/en) ?           [o/n] ')) === 'o';

  rl.close();

  console.log(`\nConfiguration : CMS=${wantCms ? 'oui' : 'non'}  i18n=${wantI18n ? 'oui' : 'non'}`);

  if (!wantCms)  removeCms(wantI18n);
  if (!wantI18n) removeI18n(wantCms);

  if (wantCms && wantI18n) {
    console.log('\n→ Tout gardé — aucune modification.');
  }

  cleanup();

  console.log('\n✓ Setup terminé. Lance "npm run build" pour vérifier.\n');
}

main();
