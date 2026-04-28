import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}"],
  theme: {
    extend: {
      colors: {
        // Toutes les couleurs pointent vers les variables CSS de global.css.
        // Pour personnaliser : modifier uniquement global.css.
        primary: "rgb(var(--primary)       / <alpha-value>)",
        secondary: "rgb(var(--secondary)     / <alpha-value>)",
        surface: "rgb(var(--surface)       / <alpha-value>)",
        "surface-alt": "rgb(var(--surface-alt)   / <alpha-value>)",
        "surface-dark": "rgb(var(--surface-dark)  / <alpha-value>)",
        muted: "rgb(var(--muted)         / <alpha-value>)",
        "text-light": "rgb(var(--text-light)    / <alpha-value>)",
        "border-rest": "rgb(var(--border)        / <alpha-value>)",
      },
      fontFamily: {
        // Pointe vers les variables CSS de global.css.
        display: ["var(--font-display)", "Georgia", "Cambria", "serif"],
        body: ["var(--font-body)", '"Segoe UI"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1200px",
      },
      // borderRadius et letterSpacing sont définis via @layer utilities dans global.css
      // pour que les var() CSS soient résolus par le navigateur (pas à la compilation).
    },
  },
  plugins: [typography],
};
