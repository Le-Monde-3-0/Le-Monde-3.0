import services from 'services';
import { AnthologiesSearchMany, AnthologiesSearchOne } from 'types/services';
import handle from 'utils/handler/handle';

export const one = async (params: AnthologiesSearchOne) =>
	handle({
		request: async () => {
			const res = await services.anthologies.search.one(params);
			return res;
		},
		name: 'anthologies.search.one',
	});

export const many = async (params: AnthologiesSearchMany) =>
	handle({
		request: async () => {
			const res = await services.anthologies.search.many(params);
			return res;
		},
		name: 'anthologies.search.many',
	});
