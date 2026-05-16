export const languages = ['en', 'pt-br'] as const;
export type Lang = (typeof languages)[number];

export const defaultLang: Lang = 'en';

export const langLabels: Record<Lang, string> = {
  en: 'EN',
  'pt-br': 'PT',
};

export const site = {
  name: 'Jamile Dev Blog',
  author: 'Jamile Bastos',
  url: 'https://jamilebastos.github.io',
  description: {
    en: 'Notes on code, systems, and the work between.',
    'pt-br': 'Notas sobre código, sistemas e o trabalho entre as linhas.',
  },
  social: {
    github: 'https://github.com/jamile-dev',
    linkedin: 'https://www.linkedin.com/',
  },
};

export const nav = {
  en: [
    { href: '/en/', label: 'Home' },
    { href: '/en/about/', label: 'About' },
    { href: '/en/blog/', label: 'Blog' },
    { href: '/en/archive/', label: 'Archive' },
  ],
  'pt-br': [
    { href: '/pt-br/', label: 'Início' },
    { href: '/pt-br/about/', label: 'Sobre' },
    { href: '/pt-br/blog/', label: 'Blog' },
    { href: '/pt-br/archive/', label: 'Arquivo' },
  ],
} satisfies Record<Lang, Array<{ href: string; label: string }>>;

export const labels = {
  en: {
    latest: 'Latest Posts',
    allPosts: 'All Posts',
    morePosts: 'more posts',
    archive: 'Archive',
    tags: 'Tags',
    recent: 'Recent',
    readMore: 'read',
    minRead: 'min read',
    language: 'Language',
    theme: 'Toggle theme',
    menu: 'Open main menu',
    rss: 'RSS',
    backHome: 'back home',
    empty: 'No posts published yet.',
  },
  'pt-br': {
    latest: 'Últimos Posts',
    allPosts: 'Todos os Posts',
    morePosts: 'mais posts',
    archive: 'Arquivo',
    tags: 'Tags',
    recent: 'Recentes',
    readMore: 'ler',
    minRead: 'min de leitura',
    language: 'Idioma',
    theme: 'Alternar tema',
    menu: 'Abrir menu principal',
    rss: 'RSS',
    backHome: 'voltar ao início',
    empty: 'Nenhum post publicado ainda.',
  },
} satisfies Record<Lang, Record<string, string>>;

export function isLang(value: string | undefined): value is Lang {
  return languages.includes(value as Lang);
}

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}

export function stripBase(pathname: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  if (base !== '/' && pathname.startsWith(base)) {
    return `/${pathname.slice(base.length)}`.replace(/\/+/g, '/');
  }
  return pathname;
}

// Post mapping: maps English slugs to Portuguese slugs (and vice versa)
// Based on matching publication dates
const postEquivalents: Record<string, Record<string, string>> = {
  en: {
    'hello-system': 'ola-sistema',
    'working-notes': 'notas-de-trabalho',
  },
  'pt-br': {
    'ola-sistema': 'hello-system',
    'notas-de-trabalho': 'working-notes',
  },
};

export function localizePath(pathname: string, targetLang: Lang): string {
  const parts = stripBase(pathname).split('/').filter(Boolean);
  if (parts.length === 0) return withBase(`/${targetLang}/`);
  
  const currentLang = parts[0] as Lang;
  
  // Handle blog post paths specially
  if (parts.length >= 3 && parts[1] === 'blog' && isLang(currentLang)) {
    const slug = parts[2];
    const equivalent = postEquivalents[currentLang]?.[slug];
    
    if (equivalent) {
      // Equivalent post exists in target language
      return withBase(`/${targetLang}/blog/${equivalent}/`);
    } else {
      // Post doesn't have an equivalent, redirect to blog list
      return withBase(`/${targetLang}/blog/`);
    }
  }
  
  // For non-blog paths, just swap language
  if (isLang(parts[0])) {
    parts[0] = targetLang;
    return withBase(`/${parts.join('/')}/`);
  }
  return withBase(`/${targetLang}/${parts.join('/')}/`);
}
