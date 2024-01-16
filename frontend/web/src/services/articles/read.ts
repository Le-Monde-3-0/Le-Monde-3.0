import { servicesURL } from 'services';
import { Article } from 'types/article';

const read = async ({ token, articleId }: { token: string; articleId: string }) =>
	servicesURL.get<Article>(`/articles/${articleId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default read;
