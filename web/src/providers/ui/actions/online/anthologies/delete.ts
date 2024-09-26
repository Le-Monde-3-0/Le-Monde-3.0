import { OnlineUserContextType } from 'contexts/onlineUser';
import { UIHandling } from 'types/handler';

const hardDelete = async (
	id: number,
	callback: () => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.anthologies.delete(id);
		handleToast({
			res,
			settings: {
				showIfSuccess: true,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Dossier supprimé.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback();
		}
	} catch (error) {
		console.error(error);
	}
};

export default hardDelete;
