import { OnlineUserContextType } from 'contexts/onlineUser';
import { UIHandling } from 'types/handler';
import { ParamsArticlesLike } from 'types/services';

const like = async (
	params: ParamsArticlesLike,
	callback: (isLiked: boolean) => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.articles.like({ ...params, isLiked: !params.isLiked });
		handleToast({
			res,
			settings: {
				showIfSuccess: true,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: {
					message: !params.isLiked ? 'Article ajouté aux favoris.' : 'Article supprimé des favoris.',
					subMessage: res.message,
				},
			},
		});
		if (res.status === 'success') {
			callback(!params.isLiked);
		}
	} catch (error) {
		console.error(error);
	}
};

export default like;
