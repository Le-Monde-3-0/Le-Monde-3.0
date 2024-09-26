import { OnlineUserContextType } from 'contexts/onlineUser';
import { Article } from 'types/article';
import { UIHandling } from 'types/handler';
import { ParamsArticlesSearch } from 'types/services';

export const allPublications = async (
	params: ParamsArticlesSearch,
	callback: (articles: Article[]) => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.articles.search.allPublications(params);
		handleToast({
			res,
			settings: {
				showIfSuccess: false,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Publications filtrées.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback(res.data!);
		}
	} catch (error) {
		console.error(error);
	}
};

export const myArticles = async (
	params: ParamsArticlesSearch,
	callback: (articles: Article[]) => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.articles.search.myArticles(params);
		handleToast({
			res,
			settings: {
				showIfSuccess: false,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Articles filtrés.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback(res.data!);
		}
	} catch (error) {
		console.error(error);
	}
};

export const likedPublications = async (
	params: ParamsArticlesSearch,
	callback: (articles: Article[]) => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.articles.search.likedPublications(params);
		handleToast({
			res,
			settings: {
				showIfSuccess: false,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Publications filtrées.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback(res.data!);
		}
	} catch (error) {
		console.error(error);
	}
};

export const oneDraft = async (
	id: number,
	callback: (article: Article) => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.articles.search.oneDraft(id);
		handleToast({
			res,
			settings: {
				showIfSuccess: true,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Brouillon trouvé.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback(res.data!);
		}
	} catch (error) {
		console.error(error);
	}
};

export const onePublication = async (
	id: number,
	callback: (article: Article) => void,
	onlineUser: OnlineUserContextType,
	handleToast: ({ res, settings, messages }: UIHandling) => void,
) => {
	try {
		const res = await onlineUser.methods.articles.search.onePublication(id);
		handleToast({
			res,
			settings: {
				showIfSuccess: true,
				showIfNotSuccess: true,
				showIfAuthError: false,
			},
			messages: {
				200: { message: 'Article trouvé.', subMessage: res.message },
			},
		});
		if (res.status === 'success') {
			callback(res.data!);
		}
	} catch (error) {
		console.error(error);
	}
};
