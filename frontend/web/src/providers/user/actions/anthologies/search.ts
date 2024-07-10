import services from 'services';
import { AnthologiesSearchMany, AnthologiesSearchOne } from 'types/services';
import handle from 'utils/handler/handle';

export const one = async ({ isOffline, params }: { isOffline: boolean; params: AnthologiesSearchOne }) => {
	if (isOffline) {
		throw new Error("Action 'anthologies.search.one' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.anthologies.search.one(params);
			return res;
		},
		name: 'anthologies.search.one',
	});
};

export const many = async ({ isOffline, params }: { isOffline: boolean; params: AnthologiesSearchMany }) => {
	if (isOffline) {
		throw new Error("Action 'anthologies.search.many' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.anthologies.search.many(params);
			return res;
		},
		name: 'anthologies.search.many',
	});
};
