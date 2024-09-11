import services from 'services';
import { OnlineUser } from 'types/user';
import handle from 'utils/handler/handle';

const me = ({ callback }: { callback: (data: OnlineUser) => void }) =>
	handle({
		request: async () => {
			const res = await services.auth.me();
			callback(res.data);
			return res;
		},
		name: 'me',
	});

export default me;
