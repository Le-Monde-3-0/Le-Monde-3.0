import services from 'services';
import { Article } from 'types/article';
import { ArticlesLike } from 'types/services';
import handle from 'utils/handler/handle';

const like = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (article: Article, isLiked: boolean) => void;
	params: ArticlesLike;
}) => {
	if (isOffline) {
		throw new Error("Action 'articles.like' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.articles.like(params);
			const articleRes = await services.articles.search.one(params);
			callback(articleRes.data, params.isLiked);
			return res;
		},
		name: 'articles.like',
	});
};

export default like;
