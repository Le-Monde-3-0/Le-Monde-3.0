import services from 'services';
import { Anthology } from 'types/anthology';
import handle from 'utils/handler/handle';

const create = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (anthology: Anthology) => void;
	params: {
		name: string;
		description: string;
		isPublic: boolean;
		articles?: number[];
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'anthologies.create' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.anthologies.create(params);
			callback(res.data);
			return res;
		},
		name: 'anthologies.create',
	});
};

export default create;
