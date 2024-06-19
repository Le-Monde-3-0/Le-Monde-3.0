import { servicesURL } from 'services';
import { Article } from 'types/article';

const create = async ({
	title,
	subtitle = 'subtitle',
	content,
	topic,
	draft,
}: {
	title: string;
	subtitle?: string;
	content: string;
	topic: number;
	draft: boolean;
}) =>
	servicesURL.post<Article>('/articles', {
		title,
		subtitle,
		content,
		topic,
		draft,
	});

export default create;
