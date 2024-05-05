import { servicesURL } from 'services';
import { Article } from 'types/article';

const liked = async ({ token }: { token: string }) =>
	servicesURL.get<Article[]>('/articles/liked', {
		headers: { Authorization: `Bearer ${token}` },
	});

export default liked;
