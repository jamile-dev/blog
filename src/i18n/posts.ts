import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase, type Lang } from './site';

export type BlogPost = CollectionEntry<'blog'>;

export async function getPublishedPosts(lang?: Lang) {
  const posts = await getCollection('blog', ({ data }) => {
    return !data.draft && (!lang || data.lang === lang);
  });

  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getEquivalentPost(
  slug: string,
  currentLang: Lang,
  targetLang: Lang
): Promise<BlogPost | null> {
  const allPosts = await getPublishedPosts();
  const currentPost = allPosts.find(
    (p) => p.data.lang === currentLang && p.slug.split('/').pop() === slug
  );

  if (!currentPost) return null;

  // Find post in target language with same publication date
  const equivalentPost = allPosts.find(
    (p) => p.data.lang === targetLang && p.data.pubDate.valueOf() === currentPost.data.pubDate.valueOf()
  );

  return equivalentPost || null;
}

export async function getAllTags(lang: Lang) {
  const posts = await getPublishedPosts(lang);
  const tags = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }
  }

  return [...tags.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export function postUrl(post: BlogPost) {
  return withBase(`/${post.data.lang}/blog/${post.slug.split('/').pop()}/`);
}

export function tagUrl(lang: Lang, tag: string) {
  return withBase(`/${lang}/tags/${encodeURIComponent(tag)}/`);
}

export function formatDate(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'pt-br' ? 'pt-BR' : 'en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
