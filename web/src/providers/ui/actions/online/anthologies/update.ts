import { OnlineUserContextType } from 'contexts/onlineUser';
import { UIHandling } from 'types/handler';

const update = async (
	id: number,
	newName: string,
	newDescription: string,
	callback: () => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.anthologies.update({
			id,
			newName,
			newDescription,
		});
		handleToast({
			res,
			settings: {
				showIfSuccess: true,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Dossier modifié.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback();
		}
	} catch (error) {
		console.error(error);
	}
};

export default update;
