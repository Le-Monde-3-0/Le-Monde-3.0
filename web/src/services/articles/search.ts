import { servicesURL } from 'services';
import { Article } from 'types/article';
import { ParamsArticlesSearch } from 'types/services';

export const allPublications = async (params: ParamsArticlesSearch) =>
	servicesURL.get<Article[]>('/articles', {
		params: {
			authorId: params.author,
			draft: params.draft,
			topicId: params.topic,
			isLiked: params.isLiked,
			anthologyId: params.anthologyId,
			q: params.query,
		},
	});

export const myArticles = async (params: ParamsArticlesSearch) =>
	servicesURL.get<Article[]>('/articles/me', {
		params: {
			authorId: params.author,
			draft: params.draft,
			topicId: params.topic,
			isLiked: params.isLiked,
			anthologyId: params.anthologyId,
			q: params.query,
		},
	});

export const likedPublications = async (params: ParamsArticlesSearch) =>
	servicesURL.get<Article[]>('/articles/liked', {
		params: {
			authorId: params.author,
			draft: params.draft,
			topicId: params.topic,
			isLiked: params.isLiked,
			anthologyId: params.anthologyId,
			q: params.query,
		},
	});

export const oneDraft = async (id: number) => servicesURL.get<Article>(`/articles/drafts/${id}`);

export const onePublication = async (id: number) => servicesURL.get<Article>(`/articles/${id}`);
