import services from 'services';
import { Anthology } from 'types/anthology';
import handle from 'utils/handler/handle';

const load = async ({ isOffline, callback }: { isOffline: boolean; callback: (anthologies: Anthology[]) => void }) => {
	if (isOffline) {
		throw new Error("Action 'anthologies.load' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.anthologies.search.many({ author: 'me' });
			callback(res.data);
			return res;
		},
		name: 'anthologies.load',
	});
};

export default load;
