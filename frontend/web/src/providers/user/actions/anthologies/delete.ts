import services from 'services';
import { AnthologiesDelete } from 'types/services';
import handle from 'utils/handler/handle';

const hardDelete = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (id: number) => void;
	params: AnthologiesDelete;
}) => {
	if (isOffline) {
		throw new Error("Action 'anthologies.delete' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.anthologies.delete(params);
			callback(params.id);
			return res;
		},
		name: 'anthologies.delete',
	});
};

export default hardDelete;
