import services from 'services';
import { AnthologiesCreate } from 'types/services';
import handle from 'utils/handler/handle';

const create = async (params: AnthologiesCreate) =>
	handle({
		request: async () => {
			const res = await services.anthologies.create(params);
			return res;
		},
		name: 'anthologies.create',
	});

export default create;
