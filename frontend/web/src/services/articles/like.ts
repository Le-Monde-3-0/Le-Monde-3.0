import { servicesURL } from 'services';
import { EmptyType } from 'types/services';

const like = async ({ id, isLiked }: { id: number; isLiked: boolean }) =>
	servicesURL.patch<EmptyType>(`/articles/${id}/like`, {
		isLiked,
	});

export default like;
