import services from 'services';
import { ArticlesLike } from 'types/services';
import handle from 'utils/handler/handle';

const like = async (params: ArticlesLike) =>
	handle({
		request: async () => {
			const res = await services.articles.like(params);
			return res;
		},
		name: 'articles.like',
	});

export default like;
