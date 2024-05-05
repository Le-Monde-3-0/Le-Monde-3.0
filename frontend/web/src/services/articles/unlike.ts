import { servicesURL } from 'services';
import { Article } from 'types/article';

const unlike = async ({ token, articleId }: { token: string; articleId: number }) =>
	servicesURL.delete<Article>(`/articles/${articleId}/likes`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default unlike;
