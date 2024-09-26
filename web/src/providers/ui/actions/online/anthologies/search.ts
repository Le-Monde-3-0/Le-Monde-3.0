import { OnlineUserContextType } from 'contexts/onlineUser';
import { Anthology } from 'types/anthology';
import { UIHandling } from 'types/handler';
import { ParamsAnthologiesSearch } from 'types/services';

export const many = async (
	params: ParamsAnthologiesSearch,
	callback: (anthologies: Anthology[]) => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.anthologies.search.many(params);
		handleToast({
			res,
			settings: {
				showIfSuccess: false,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Dossiers filtrés.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback(res.data!);
		}
	} catch (error) {
		console.error(error);
	}
};

export const one = async (
	id: number,
	callback: (anthology: Anthology) => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.anthologies.search.one(id);
		handleToast({
			res,
			settings: {
				showIfSuccess: true,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Dossiers trouvé.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback(res.data!);
		}
	} catch (error) {
		console.error(error);
	}
};
