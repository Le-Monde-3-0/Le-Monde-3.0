import services from 'services';
import { Anthology } from 'types/anthology';
import { AnthologiesUpdate } from 'types/services';
import handle from 'utils/handler/handle';

const update = ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (anthology: Anthology) => void;
	params: AnthologiesUpdate;
}) => {
	if (isOffline) {
		throw new Error("Action 'anthologies.update' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.anthologies.update(params);
			callback(res.data);
			return res;
		},
		name: 'anthologies.update',
	});
};

export default update;
