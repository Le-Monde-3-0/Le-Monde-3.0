import { AxiosResponse } from 'axios';

import { servicesURL } from 'services';
import { Article } from 'types/article';

type MeRes = Article[];

const me = async ({ token }: { token: string }): Promise<AxiosResponse<MeRes>> =>
	servicesURL.get('/articles/me', {
		headers: { Authorization: `Bearer ${token}` },
	});

export default me;
