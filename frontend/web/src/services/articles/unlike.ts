import { servicesURL } from 'services';

const unlike = async ({ token, articleId }: { token: string; articleId: string }) =>
	servicesURL.delete(`/articles/${articleId}/likes`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default unlike;
