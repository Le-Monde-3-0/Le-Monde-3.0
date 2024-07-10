import { servicesURL } from 'services';
import { ArticlesLike, EmptyResponse } from 'types/services';

const like = async (params: ArticlesLike) =>
	servicesURL.patch<EmptyResponse>(`/articles/${params.id}/like`, {
		isLiked: params.isLiked,
	});

export default like;
