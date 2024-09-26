import { servicesURL } from 'services';
import { ParamsArticlesLike, ResponseEmpty } from 'types/services';

const like = async (params: ParamsArticlesLike) =>
	servicesURL.patch<ResponseEmpty>(`/articles/${params.id}/like`, {
		isLiked: params.isLiked,
	});

export default like;
