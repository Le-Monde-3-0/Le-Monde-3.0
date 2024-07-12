import services from 'services';
import { Article } from 'types/article';
import handle from 'utils/handler/handle';

export const liked = async ({
	isOffline,
	callback,
}: {
	isOffline: boolean;
	callback: (articles: Article[]) => void;
}) => {
	if (isOffline) {
		throw new Error("Action 'articles.load.liked' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.articles.search.many({ isLiked: true });
			callback(res.data);
			return res;
		},
		name: 'articles.load.liked',
	});
};

export const written = async ({
	isOffline,
	callback,
}: {
	isOffline: boolean;
	callback: (articles: Article[]) => void;
}) => {
	if (isOffline) {
		throw new Error("Action 'articles.load.written' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.articles.search.many({ author: 'me' });
			callback(res.data);
			return res;
		},
		name: 'articles.load.written',
	});
};
