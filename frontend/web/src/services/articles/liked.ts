import { servicesURL } from 'services';

const liked = async ({ token }: { token: string }) =>
	servicesURL.get('/articles/liked', {
		headers: { Authorization: `Bearer ${token}` },
	});

export default liked;
