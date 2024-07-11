import services from 'services';
import { Auth } from 'types/auth';
import handle from 'utils/handler/handle';

const me = ({ callback }: { callback: (auth: Auth) => void }) =>
	handle({
		request: async () => {
			const res = await services.auth.me();
			callback(res.data);
			return res;
		},
		name: 'me',
	});

export default me;
