import services from 'services';
import { ArticlesSearchMany, ArticlesSearchOne } from 'types/services';
import handle from 'utils/handler/handle';

export const one = async (params: ArticlesSearchOne) =>
	handle({
		request: async () => {
			const res = await services.articles.search.one(params);
			return res;
		},
		name: 'articles.search.one',
	});

export const many = async (params: ArticlesSearchMany) =>
	handle({
		request: async () => {
			const res = await services.articles.search.many(params);
			return res;
		},
		name: 'articles.search.many',
	});
