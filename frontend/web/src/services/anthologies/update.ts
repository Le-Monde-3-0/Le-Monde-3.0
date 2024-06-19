import { servicesURL } from 'services';
import { Anthology } from 'types/anthology';

const update = async ({
	id,
	addArticles = [],
	removeArticles = [],
	newName,
	newDescription,
	newIsPublic,
}: {
	id: number;
	addArticles?: number[];
	removeArticles?: number[];
	newName?: string;
	newDescription?: string;
	newIsPublic?: boolean;
}) =>
	servicesURL.patch<Anthology>(`/anthologies/${id}`, {
		addArticles,
		removeArticles,
		name: newName,
		description: newDescription,
		newIsPublic: newIsPublic,
	});

export default update;
