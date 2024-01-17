import { servicesURL } from 'services';
import { Article } from 'types/article';

const addArticle = async ({ token, bookmarkId, articleId }: { token: string; bookmarkId: number; articleId: number }) =>
	servicesURL.post<Article>(
		`/bookmarks/${bookmarkId}/articles/${articleId}`,
		{},
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

const removeArticle = async ({
	token,
	bookmarkId,
	articleId,
}: {
	token: string;
	bookmarkId: number;
	articleId: number;
}) =>
	servicesURL.delete<Article>(`/bookmarks/${bookmarkId}/articles/${articleId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export { addArticle, removeArticle };
