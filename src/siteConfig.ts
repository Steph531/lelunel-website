/**
 * Configuration globale du site
 * Modifiez ces valeurs pour activer ou désactiver les fonctionnalités.
 */
export const siteConfig = {
    /**
     * Mode d'affichage du menu :
     * - 'pdf'  → ouvre brand.menu_file dans un nouvel onglet (target="_blank")
     * - 'page' → navigation interne vers la page /carte/
     */
    menu: "pdf" as "pdf" | "page",

    /**
     * Gestion multilingue :
     * - true  → routes /fr/ et /en/ actives, sélecteur de langue visible dans la nav
     * - false → uniquement le français, URLs sans préfixe (/carte/ au lieu de /fr/carte/)
     *           (un fichier dist/_redirects est généré automatiquement au build)
     */
    multilanguage: true,

    /**
     * Page "Notre Histoire" (/histoire/) :
     * - true  → page accessible, liens présents dans la nav, le footer et la section about
     * - false → page masquée, tous les liens vers /histoire/ sont supprimés
     */
    histoire: true,

    /**
     * Mode chef :
     * - true  → affiche la section chef (profil + timeline) sur la page Notre Histoire
     * - false → page Notre Histoire = histoire du resto + valeurs + équipe uniquement
     */
    chef: true,
} as const;
