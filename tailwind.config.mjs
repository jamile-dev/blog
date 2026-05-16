import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        ink: 'var(--color-bg)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        panel: 'var(--color-panel)',
        lime: 'var(--color-accent)',
        line: 'var(--color-line)',
      },
    },
  },
  plugins: [typography],
};
