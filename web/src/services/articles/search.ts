import { servicesURL } from 'services';
import { Article } from 'types/article';
import { ArticlesSearchMany, ArticlesSearchOne } from 'types/services';

export const one = async (params: ArticlesSearchOne) => servicesURL.get<Article>(`/articles/${params.id}`);

export const many = async (params: ArticlesSearchMany) =>
	servicesURL.get<Article[]>('/articles', {
		params: {
			author: params.author,
			draft: params.draft,
			topic: params.topic,
			isLiked: params.isLiked,
			anthologyId: params.anthologyId,
			q: params.query,
		},
	});
