import { servicesURL } from 'services';
import { Anthology } from 'types/anthology';
import { ParamsAnthologiesCreate } from 'types/services';

const create = async (params: ParamsAnthologiesCreate) =>
	servicesURL.post<Anthology>('/anthologies', {
		name: params.name,
		description: params.description,
		isPublic: params.isPublic,
		articles: params.articles || [],
	});

export default create;
