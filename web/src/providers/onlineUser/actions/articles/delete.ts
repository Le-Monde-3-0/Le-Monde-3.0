import services from 'services';
import { ArticlesDelete } from 'types/services';
import handle from 'utils/handler/handle';

const hardDelete = async (params: ArticlesDelete) =>
	handle({
		request: async () => {
			const res = await services.articles.delete(params);
			return res;
		},
		name: 'articles.delete',
	});

export default hardDelete;
