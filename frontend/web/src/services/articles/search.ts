import { servicesURL } from 'services';
import { Article } from 'types/article';

const searchMany = async ({
	author = 'me',
	draft,
	topic,
	isLiked,
	anthologyId,
	query,
}: {
	author?: string;
	draft?: boolean;
	topic?: number;
	isLiked?: boolean;
	anthologyId?: number;
	query?: string;
}) =>
	servicesURL.get<Article[]>('/articles', {
		params: {
			author,
			draft,
			topic,
			isLiked,
			anthologyId,
			q: query,
		},
	});

const searchOne = async (id: number) => servicesURL.get<Article>(`/articles/${id}`);

export { searchMany, searchOne };
