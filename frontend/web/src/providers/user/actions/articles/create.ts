import services from 'services';
import { Article } from 'types/article';
import { ArticlesCreate } from 'types/services';
import handle from 'utils/handler/handle';

const create = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (article: Article) => void;
	params: ArticlesCreate;
}) => {
	if (isOffline) {
		throw new Error("Action 'articles.create' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.articles.create(params);
			callback(res.data);
			return res;
		},
		name: 'articles.create',
	});
};

export default create;
