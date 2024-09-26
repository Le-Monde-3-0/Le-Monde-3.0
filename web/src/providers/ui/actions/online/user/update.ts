import { OnlineUserContextType } from 'contexts/onlineUser';
import { UIHandling } from 'types/handler';
import { ParamsUserUpdatePassword } from 'types/services';

export const password = async (
	params: ParamsUserUpdatePassword,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.user.update.password(params);
		handleToast({
			res,
			settings: {
				showIfSuccess: true,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Mot de passe modifié.', subMessage: res.message },
			},
		});
	} catch (error) {
		console.error(error);
	}
};

export const email = async (
	newEmail: string,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.user.update.email(newEmail);
		handleToast({
			res,
			settings: {
				showIfSuccess: true,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Email modifié.', subMessage: res.message },
			},
		});
	} catch (error) {
		console.error(error);
	}
};

export const username = async (
	newUsername: string,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.user.update.username(newUsername);
		handleToast({
			res,
			settings: {
				showIfSuccess: true,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: "Nom d'utilisateur modifié.", subMessage: res.message },
			},
		});
	} catch (error) {
		console.error(error);
	}
};
