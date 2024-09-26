import { OnlineUserContextType } from 'contexts/onlineUser';
import { UIHandling } from 'types/handler';
import { Topic } from 'types/topic';

export const all = async (
	callback: (topics: Topic[]) => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.topics.search.all();
		handleToast({
			res,
			settings: {
				showIfSuccess: false,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Sujets récupérés.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback(res.data!);
		}
	} catch (error) {
		console.error(error);
	}
};
