import { OnlineUserContextType } from 'contexts/onlineUser';
import { UIHandling } from 'types/handler';

const me = async (
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.user.me();
		handleToast({
			res,
			settings: {
				showIfSuccess: false,
				showIfNotSuccess: true,
				showIfAuthError: true,
			},
			messages: {
				200: { message: 'Profil récupéré.', subMessage: res.message },
			},
		});
	} catch (error) {
		console.error(error);
	}
};

export default me;
