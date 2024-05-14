import { servicesURL } from 'services';
import { MeType } from 'types/services';

const me = async ({ token }: { token: string }) =>
	servicesURL.get<MeType>('/users/me', {
		headers: { Authorization: `Bearer ${token}` },
	});

export default me;
