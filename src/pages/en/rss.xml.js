import rss from '@astrojs/rss';
import { getPublishedPosts, postUrl } from '@i18n/posts';
import { site } from '@i18n/site';

export async function GET(context) {
  const posts = await getPublishedPosts('en');
  return rss({
    title: `${site.name} - English`,
    description: site.description.en,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  });
}
