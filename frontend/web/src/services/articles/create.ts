import { servicesURL } from 'services';

const create = async ({ token, title, content }: { token: string; title: string; content: string }) =>
	servicesURL.post(
		'/articles',
		{
			title,
			content,
		},
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

export default create;
