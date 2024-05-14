import { servicesURL } from 'services';
import { Stats } from 'types/stats';

const getStats = async ({ token }: { token: string }) =>
	servicesURL.get<Stats>(`/user/stats`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default getStats;
