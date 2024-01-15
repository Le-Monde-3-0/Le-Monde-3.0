import { servicesURL } from 'services';

const publish = async ({ token, title, content }: { token: string; title: string; content: string }) =>
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

export default publish;
