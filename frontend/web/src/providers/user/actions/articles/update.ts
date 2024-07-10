import services from 'services';
import { Article } from 'types/article';
import { ArticlesUpdate } from 'types/services';
import handle from 'utils/handler/handle';

const update = ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (article: Article) => void;
	params: ArticlesUpdate;
}) => {
	if (isOffline) {
		throw new Error("Action 'articles.update' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.articles.update(params);
			callback(res.data);
			return res;
		},
		name: 'articles.update',
	});
};

export default update;
