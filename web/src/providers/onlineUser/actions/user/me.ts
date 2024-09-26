import services from 'services';
import { OnlineUser } from 'types/user';
import handle from 'utils/handler/handle';

const me = (callback: (data: OnlineUser) => void) =>
	handle(async () => {
		const res = await services.user.me();
		callback(res.data);
		return res;
	});

export default me;
