import { AxiosResponse } from 'axios';

import { servicesURL } from 'services';
import { Article } from 'types/article';

type PublishRes = Article;

const publish = async ({
	token,
	title,
	content,
}: {
	token: string;
	title: string;
	content: string;
}): Promise<AxiosResponse<PublishRes>> =>
	servicesURL.post(
		'/articles',
		{
			title,
			content,
		},
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

export default publish;
