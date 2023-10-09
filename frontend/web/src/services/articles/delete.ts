import { AxiosResponse } from 'axios';

import { servicesURL } from 'services';

type HardDeleteRes = {
	delete: string;
};

const hardDelete = async ({
	token,
	articleId,
}: {
	token: string;
	articleId: number;
}): Promise<AxiosResponse<HardDeleteRes>> =>
	servicesURL.delete(`/articles/${articleId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

export default hardDelete;
