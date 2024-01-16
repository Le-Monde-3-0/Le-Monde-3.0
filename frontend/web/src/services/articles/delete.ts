import { servicesURL } from 'services';

const hardDelete = async ({ token, articleId }: { token: string; articleId: number }) =>
	servicesURL.delete<{ delete: string }>(`/articles/${articleId.toString()}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default hardDelete;
