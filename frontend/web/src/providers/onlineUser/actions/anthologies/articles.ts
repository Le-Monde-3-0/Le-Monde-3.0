import services from 'services';
import { AnthologiesArticles } from 'types/services';
import handle from 'utils/handler/handle';

const articles = async (params: AnthologiesArticles) =>
	handle({
		request: async () => {
			const res = await services.anthologies.articles(params);
			return res;
		},
		name: 'anthologies.articles',
	});

export default articles;
