import services from 'services';
import { AnthologiesDelete } from 'types/services';
import handle from 'utils/handler/handle';

const hardDelete = async (params: AnthologiesDelete) =>
	handle({
		request: async () => {
			const res = await services.anthologies.delete(params);
			return res;
		},
		name: 'anthologies.delete',
	});

export default hardDelete;
