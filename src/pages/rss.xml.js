import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	const sortedPosts = posts.sort((a, b) => b.data.pubDate - a.data.pubDate);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: sortedPosts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug}/`,
		})),
	});
}
