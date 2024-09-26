import { servicesURL } from 'services';
import { Anthology } from 'types/anthology';
import { ParamsAnthologiesSearch } from 'types/services';

export const many = async (params: ParamsAnthologiesSearch) =>
	servicesURL.get<Anthology[]>('/anthologies', {
		params: {
			author: params.author,
			q: params.query,
		},
	});

export const one = async (id: number) => servicesURL.get<Anthology>(`/anthologies/${id}`);
