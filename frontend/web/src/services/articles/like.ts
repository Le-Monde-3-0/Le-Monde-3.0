import { servicesURL } from 'services';

const like = async ({ token, articleId }: { token: string; articleId: string }) =>
	servicesURL.post(
		`/articles/${articleId}/likes`,
		{},
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

export default like;
