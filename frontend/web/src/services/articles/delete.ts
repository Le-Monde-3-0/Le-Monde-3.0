import { servicesURL } from 'services';

const hardDelete = async ({ token, articleId }: { token: string; articleId: string }) =>
	servicesURL.delete(`/articles/${articleId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default hardDelete;
