import { servicesURL } from 'services';
import Bookmark from 'types/bookmark';

const update = async ({
	token,
	bookmarkId,
	title,
	description,
}: {
	bookmarkId: number;
	token: string;
	title: string;
	description: string;
}) =>
	servicesURL.put<Bookmark>(
		`/bookmarks/${bookmarkId}`,
		{ title, description },
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

export default update;
