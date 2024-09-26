import { servicesURL } from 'services';
import { Article } from 'types/article';
import { ParamsArticlesCreate } from 'types/services';

const create = async (params: ParamsArticlesCreate) =>
	servicesURL.post<Article>('/articles', {
		title: params.title,
		subtitle: params.subtitle || 'subtitle',
		content: params.content,
		topic: params.topic,
		draft: params.draft,
	});

export default create;
