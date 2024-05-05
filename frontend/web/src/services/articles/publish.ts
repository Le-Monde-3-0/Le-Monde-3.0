import { servicesURL } from 'services';
import { Article } from 'types/article';

const publish = async ({
	token,
	title,
	topic,
	content,
	draft = false,
}: {
	token: string;
	title: string;
	topic: string;
	content: string;
	draft?: boolean;
}) =>
	servicesURL.post<Article>(
		'/articles',
		{
			authorname: 'authorname',
			content,
			draft,
			subtitle: 'subtitle',
			title,
			topic,
		},
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

export default publish;
