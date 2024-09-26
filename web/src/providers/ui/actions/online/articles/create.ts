import { OnlineUserContextType } from 'contexts/onlineUser';
import { UIHandling } from 'types/handler';
import { ParamsArticlesCreate } from 'types/services';

const create = async (
	params: ParamsArticlesCreate,
	callback: (id: number) => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.articles.create(params);
		handleToast({
			res,
			settings: {
				showIfSuccess: true,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				201: { message: 'Article créé.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback(res.data!.id);
		}
	} catch (error) {
		console.error(error);
	}
};

export default create;
