import { AxiosResponse } from 'axios';

import { servicesURL } from 'services';
import { Article } from 'types/article';

type LikeRes = Article;

const like = async ({ token, articleId }: { token: string; articleId: number }): Promise<AxiosResponse<LikeRes>> =>
	servicesURL.post(
		`/articles/${articleId}/likes`,
		{},
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

export default like;
