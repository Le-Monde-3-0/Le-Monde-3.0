import services from 'services';
import { Article } from 'types/article';
import { AnthologiesArticles } from 'types/services';
import handle from 'utils/handler/handle';

const articles = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (id: number, articles: Article[]) => void;
	params: AnthologiesArticles;
}) => {
	if (isOffline) {
		throw new Error("Action 'anthologies.articles' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.anthologies.articles(params);
			callback(params.id, res.data);
			return res;
		},
		name: 'anthologies.articles',
	});
};

export default articles;
