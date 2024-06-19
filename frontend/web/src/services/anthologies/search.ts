import { servicesURL } from 'services';
import { Anthology } from 'types/anthology';

const searchMany = async ({ author = 'me', query }: { author?: string; query?: string }) =>
	servicesURL.get<Anthology[]>('/anthologies', {
		params: {
			author,
			q: query,
		},
	});

const searchOne = async (id: number) => servicesURL.get<Anthology>(`/anthologies/${id}`);

export { searchMany, searchOne };
