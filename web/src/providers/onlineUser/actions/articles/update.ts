import services from 'services';
import { ArticlesUpdate } from 'types/services';
import handle from 'utils/handler/handle';

const update = (params: ArticlesUpdate) =>
	handle({
		request: async () => {
			const res = await services.articles.update(params);
			return res;
		},
		name: 'articles.update',
	});

export default update;
