import { AxiosResponse } from 'axios';

import { servicesURL } from 'services';
import { Article } from 'types/article';

type UnlikeRes = Article;

const unlike = async ({ token, articleId }: { token: string; articleId: number }): Promise<AxiosResponse<UnlikeRes>> =>
	servicesURL.delete(`/articles/${articleId}/likes`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default unlike;
