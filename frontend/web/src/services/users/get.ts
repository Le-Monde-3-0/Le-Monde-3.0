import { servicesURL } from 'services';

const get = async ({ token, userId }: { token: string; userId: number }) =>
	servicesURL.get<{
		id: number;
		email: string;
		username: string;
	}>(`/users/users/${userId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default get;
