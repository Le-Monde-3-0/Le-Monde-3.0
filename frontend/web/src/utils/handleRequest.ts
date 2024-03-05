import { AxiosError, AxiosResponse } from 'axios';

type RequestResponse<Type> = {
	code: number;
	status: 'error' | 'info' | 'warning' | 'success' | 'loading';
	message: string;
	subMessage: string | undefined;
	data: Type | undefined;
};

const handleRequestTable: { [key: string]: RequestResponse<never>[] } = {
	login: [
		{
			code: 200,
			status: 'success',
			message: 'Connexion réussie.',
			subMessage: undefined,
			data: undefined,
		},
		{
			code: 400,
			status: 'error',
			message: 'Paramètres invalides.',
			subMessage: undefined,
			data: undefined,
		},
	],
	register: [
		{
			code: 201,
			status: 'success',
			message: 'Inscription réussie.',
			subMessage: undefined,
			data: undefined,
		},
		{
			code: 400,
			status: 'error',
			message: 'Paramètres invalides.',
			subMessage: undefined,
			data: undefined,
		},
	],
	getPublishedArticles: [
		{
			code: 200,
			status: 'success',
			message: 'Articles publiés récupérés.',
			subMessage: undefined,
			data: undefined,
		},
	],
	getDraftArticles: [
		{
			code: 200,
			status: 'success',
			message: 'Articles brouillons récupérés.',
			subMessage: undefined,
			data: undefined,
		},
	],
	getLikedArticles: [
		{
			code: 200,
			status: 'success',
			message: 'Articles aimés récupérés.',
			subMessage: undefined,
			data: undefined,
		},
	],
	getArticle: [
		{
			code: 200,
			status: 'success',
			message: 'Article récupéré.',
			subMessage: undefined,
			data: undefined,
		},
		{
			code: 404,
			status: 'error',
			message: 'Article inconnu.',
			subMessage: undefined,
			data: undefined,
		},
	],
	getBookmark: [
		{
			code: 404,
			status: 'error',
			message: 'Marque-page inconnu.',
			subMessage: undefined,
			data: undefined,
		},
	],
	addArticle: [
		{
			code: 201,
			status: 'success',
			message: 'Article créé.',
			subMessage: undefined,
			data: undefined,
		},
		{
			code: 400,
			status: 'error',
			message: 'Paramètres invalides.',
			subMessage: undefined,
			data: undefined,
		},
	],
	switchArticleDraftState: [
		{
			code: 200,
			status: 'success',
			message: "Status de l'article changé",
			subMessage: undefined,
			data: undefined,
		},
	],
	deletePublishedArticle: [
		{
			code: 200,
			status: 'success',
			message: 'Article publié supprimé.',
			subMessage: undefined,
			data: undefined,
		},
	],
	likeArticle: [
		{
			code: 200,
			status: 'success',
			message: 'Article aimé.',
			subMessage: undefined,
			data: undefined,
		},
	],
	unlikeArticle: [
		{
			code: 200,
			status: 'success',
			message: 'Article dé-aimé.',
			subMessage: undefined,
			data: undefined,
		},
	],
	getBookmarks: [
		{
			code: 200,
			status: 'success',
			message: 'Marque-pages récupérés.',
			subMessage: undefined,
			data: undefined,
		},
	],
	addBookmark: [
		{
			code: 201,
			status: 'success',
			message: 'Marque-page créé.',
			subMessage: undefined,
			data: undefined,
		},
		{
			code: 400,
			status: 'error',
			message: 'Paramètres invalides.',
			subMessage: undefined,
			data: undefined,
		},
	],
	updateBookmark: [
		{
			code: 200,
			status: 'success',
			message: 'Marque-page modifié.',
			subMessage: undefined,
			data: undefined,
		},
		{
			code: 400,
			status: 'error',
			message: 'Paramètres invalides.',
			subMessage: undefined,
			data: undefined,
		},
	],
	deleteBookmark: [
		{
			code: 200,
			status: 'success',
			message: 'Marque-page supprimé.',
			subMessage: undefined,
			data: undefined,
		},
	],
	addArticleToBookmark: [
		{
			code: 200,
			status: 'success',
			message: 'Article ajouté au marque-page.',
			subMessage: undefined,
			data: undefined,
		},
	],
};

const unkownAxiosResponse: RequestResponse<never> = {
	code: 0,
	status: 'info',
	message: 'status code unhandled',
	subMessage: undefined,
	data: undefined,
};

const internalError: RequestResponse<never> = {
	code: 500,
	status: 'error',
	message: 'Erreur du service interne.',
	subMessage: undefined,
	data: undefined,
};

const unknowError: RequestResponse<never> = {
	code: 0,
	status: 'info',
	message: 'error unhandled',
	subMessage: undefined,
	data: undefined,
};

const handleRequest = async <Type>({
	request,
	requestName,
}: {
	request: () => Promise<AxiosResponse<Type>>;
	requestName: string;
}): Promise<RequestResponse<Type>> => {
	try {
		const res = await request();
		const output = handleRequestTable[requestName].find((r) => r.code === res.status);
		return output ? { ...output, data: res.data } : unkownAxiosResponse;
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			const errorCode = error.response ? error.response.status : 0;
			if (errorCode === 500) return internalError;
			const errorMessage = error.response?.data.error || 'No message provided from the backend';
			const output = handleRequestTable[requestName].find((r) => r.code === errorCode);
			return output ? { ...output, subMessage: errorMessage } : unkownAxiosResponse;
		}
		return unknowError;
	}
};

export type { RequestResponse };
export default handleRequest;
