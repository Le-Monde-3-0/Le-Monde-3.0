import { AxiosResponse } from 'axios';

import { servicesURL } from 'services';
import { Article } from 'types/article';

type ReadRes = Article;

const read = async ({ token, articleId }: { token: string; articleId: number }): Promise<AxiosResponse<ReadRes>> =>
	servicesURL.get(`/articles/${articleId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default read;
