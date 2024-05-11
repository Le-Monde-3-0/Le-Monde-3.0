import { servicesURL } from 'services';
import { Bookmark } from 'types/bookmark';

const get = async ({ token, bookmarkId }: { token: string; bookmarkId: number }) =>
	servicesURL.get<Bookmark>(`/bookmarks/${bookmarkId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

const getAll = async ({ token }: { token: string }) =>
	servicesURL.get<Bookmark[]>('/bookmarks', {
		headers: { Authorization: `Bearer ${token}` },
	});

export { get, getAll };
