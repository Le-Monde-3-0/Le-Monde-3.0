import services from 'services';
import { TopicsSearchOne } from 'types/services';
import handle from 'utils/handler/handle';

export const one = async ({ isOffline, params }: { isOffline: boolean; params: TopicsSearchOne }) => {
	if (isOffline) {
		throw new Error("Action 'topics.search.one' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.topics.search.one(params);
			return res;
		},
		name: 'topics.search.one',
	});
};

export const all = async ({ isOffline }: { isOffline: boolean }) => {
	if (isOffline) {
		throw new Error("Action 'topics.search.all' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.topics.search.all();
			return res;
		},
		name: 'topics.search.all',
	});
};
