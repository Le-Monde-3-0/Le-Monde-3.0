import { servicesURL } from 'services';
import { Anthology } from 'types/anthology';

const create = async ({
	name,
	description,
	isPublic,
	articles = [],
}: {
	name: string;
	description: string;
	isPublic: boolean;
	articles?: number[];
}) => servicesURL.post<Anthology>('/anthologies', { name, description, isPublic, articles });

export default create;
