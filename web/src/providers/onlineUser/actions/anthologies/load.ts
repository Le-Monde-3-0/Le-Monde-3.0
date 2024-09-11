import services from 'services';
import handle from 'utils/handler/handle';

const load = async () =>
	handle({
		request: async () => {
			const res = await services.anthologies.search.many({ author: 'me' });
			return res;
		},
		name: 'anthologies.load',
	});

export default load;
