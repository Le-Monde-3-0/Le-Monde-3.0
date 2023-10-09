import { AxiosResponse } from 'axios';

import { servicesURL } from 'services';
import { Article } from 'types/article';

type LikedRes = Article[];

const liked = async ({ token }: { token: string }): Promise<AxiosResponse<LikedRes>> =>
	servicesURL.get('/articles/liked', {
		headers: { Authorization: `Bearer ${token}` },
	});

export default liked;
