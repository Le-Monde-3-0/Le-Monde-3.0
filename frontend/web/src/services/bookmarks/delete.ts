import { servicesURL } from 'services';

const hardDelete = async ({ token, bookmarkId }: { token: string; bookmarkId: number }) =>
	servicesURL.delete<{ delete: string }>(`/bookmarks/${bookmarkId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default hardDelete;
