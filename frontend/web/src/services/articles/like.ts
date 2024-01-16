import { servicesURL } from 'services';
import { Article } from 'types/article';

const like = async ({ token, articleId }: { token: string; articleId: string }) =>
	servicesURL.post<Article>(
		`/articles/${articleId}/likes`,
		{},
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

export default like;
