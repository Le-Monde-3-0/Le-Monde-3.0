import { servicesURL } from 'services';
import { Anthology } from 'types/anthology';
import { AnthologiesUpdate } from 'types/services';

const update = async (params: AnthologiesUpdate) =>
	servicesURL.patch<Anthology>(`/anthologies/${params.id}`, {
		addArticles: params.addArticles || [],
		removeArticles: params.removeArticles || [],
		name: params.newName,
		description: params.newDescription,
		newIsPublic: params.newIsPublic,
	});

export default update;
