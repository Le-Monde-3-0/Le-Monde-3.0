import { servicesURL } from 'services';

const me = async ({ token }: { token: string }) =>
	servicesURL.get('/articles/me', {
		headers: { Authorization: `Bearer ${token}` },
	});

export default me;
