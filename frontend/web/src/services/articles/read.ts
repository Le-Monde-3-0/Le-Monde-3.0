import { servicesURL } from 'services';

const read = async ({ token, articleId }: { token: string; articleId: string }) =>
	servicesURL.get(`/articles/${articleId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default read;
