import services from 'services';
import { TopicsSearchOne } from 'types/services';
import handle from 'utils/handler/handle';

export const one = async (params: TopicsSearchOne) =>
	handle({
		request: async () => {
			const res = await services.topics.search.one(params);
			return res;
		},
		name: 'topics.search.one',
	});

export const all = async () =>
	handle({
		request: async () => {
			const res = await services.topics.search.all();
			return res;
		},
		name: 'topics.search.all',
	});
