import services from 'services';
import { ArticlesCreate } from 'types/services';
import handle from 'utils/handler/handle';

const create = async (params: ArticlesCreate) =>
	handle({
		request: async () => {
			const res = await services.articles.create(params);
			return res;
		},
		name: 'articles.create',
	});

export default create;
