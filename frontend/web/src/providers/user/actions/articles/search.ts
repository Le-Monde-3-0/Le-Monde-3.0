import services from 'services';
import { ArticlesSearchMany, ArticlesSearchOne } from 'types/services';
import handle from 'utils/handler/handle';

export const one = async ({ isOffline, params }: { isOffline: boolean; params: ArticlesSearchOne }) => {
	if (isOffline) {
		throw new Error("Action 'articles.search.one' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.articles.search.one(params);
			return res;
		},
		name: 'articles.search.one',
	});
};

export const many = async ({ isOffline, params }: { isOffline: boolean; params: ArticlesSearchMany }) => {
	if (isOffline) {
		throw new Error("Action 'articles.search.many' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.articles.search.many(params);
			return res;
		},
		name: 'articles.search.many',
	});
};
