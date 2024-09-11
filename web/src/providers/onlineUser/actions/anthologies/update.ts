import services from 'services';
import { AnthologiesUpdate } from 'types/services';
import handle from 'utils/handler/handle';

const update = (params: AnthologiesUpdate) =>
	handle({
		request: async () => {
			const res = await services.anthologies.update(params);
			return res;
		},
		name: 'anthologies.update',
	});

export default update;
