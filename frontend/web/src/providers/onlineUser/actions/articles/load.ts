import services from 'services';
import handle from 'utils/handler/handle';

export const liked = async () =>
	handle({
		request: async () => {
			const res = await services.articles.search.many({ isLiked: true });
			return res;
		},
		name: 'articles.load.liked',
	});

export const written = async () =>
	handle({
		request: async () => {
			const res = await services.articles.search.many({ author: 'me' });
			return res;
		},
		name: 'articles.load.written',
	});
