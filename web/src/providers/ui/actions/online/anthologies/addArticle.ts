import { OnlineUserContextType } from 'contexts/onlineUser';
import { UIHandling } from 'types/handler';

const addArticle = async (
	id: number,
	articleId: number,
	callback: () => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.anthologies.update({
			id,
			addArticles: [articleId],
		});
		handleToast({
			res,
			settings: {
				showIfSuccess: true,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Article ajouté au dossier.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback();
		}
	} catch (error) {
		console.error(error);
	}
};

export default addArticle;