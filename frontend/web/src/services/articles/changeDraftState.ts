import { servicesURL } from 'services';
import { Article } from 'types/article';

const changeDraftState = async ({ token, articleId, state }: { token: string; articleId: number; state: boolean }) =>
	servicesURL.put<Article>(
		`/articles/${articleId}/draft`,
		{ draft: state },
		{ headers: { Authorization: `Bearer ${token}` } },
	);

export default changeDraftState;
