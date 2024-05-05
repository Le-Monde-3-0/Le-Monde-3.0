import { servicesURL } from 'services';
import { Article } from 'types/article';

const me = async ({ token }: { token: string }) =>
	servicesURL.get<Article[]>('/articles/me', {
		headers: { Authorization: `Bearer ${token}` },
	});

export default me;
