import { servicesURL } from 'services';
import { Anthology } from 'types/anthology';
import { AnthologiesSearchMany, AnthologiesSearchOne } from 'types/services';

export const one = async (params: AnthologiesSearchOne) => servicesURL.get<Anthology>(`/anthologies/${params.id}`);

export const many = async (params: AnthologiesSearchMany) =>
	servicesURL.get<Anthology[]>('/anthologies', {
		params: {
			author: params.author,
			q: params.query,
		},
	});
