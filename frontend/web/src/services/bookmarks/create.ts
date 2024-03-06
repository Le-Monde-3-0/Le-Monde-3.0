import { servicesURL } from 'services';
import { Bookmark } from 'types/bookmark';

const create = async ({ token, title, description }: { token: string; title: string; description: string }) =>
	servicesURL.post<Bookmark>(
		'/bookmarks',
		{ title, description },
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

export default create;
