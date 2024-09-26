import { servicesURL } from 'services';
import { Article } from 'types/article';
import { ParamsArticlesUpdate } from 'types/services';

const update = async (params: ParamsArticlesUpdate) =>
	servicesURL.patch<Article>(`/articles/${params.id}`, {
		title: params.newTitle,
		subtitle: params.newSubtitle,
		content: params.newContent,
		topic: params.newTopic,
		draft: params.newDraft,
	});

export default update;
