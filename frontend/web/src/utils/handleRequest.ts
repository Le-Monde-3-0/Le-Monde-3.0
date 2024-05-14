import { AxiosError, AxiosResponse } from 'axios';

const englishErrorMapping = [
	{
		english: 'an account with this username already exists',
		french: "Nom d'utilisateur déjà existant.",
	},
	{
		english: 'an account with this email already exists',
		french: 'Email déjà existant.',
	},
	{
		english: 'No message provided from the backend',
		french: 'Pas de message renvoyé par le backend',
	},
];

const findFrenchMapping = (englishError: string) => englishErrorMapping.find((e) => e.english === englishError)?.french;

type RequestResponse<Type> = {
	code: number;
	status: 'error' | 'info' | 'warning' | 'success' | 'loading';
	message: string;
	subMessage: string | undefined;
	data: Type | undefined;
};

const unhandledResponse: RequestResponse<never> = {
	code: 0,
	status: 'info',
	message: 'Status code unhandled.',
	subMessage: "This message shouldn't appear.",
	data: undefined,
};

const unknowError: RequestResponse<never> = {
	code: 0,
	status: 'info',
	message: 'Non-axios error.',
	subMessage: "This message should't appear.",
	data: undefined,
};

const okResponse = (message: string, subMessage?: string): RequestResponse<never> => ({
	code: 200,
	status: 'success',
	message,
	subMessage,
	data: undefined,
});

const createdResponse = (message: string, subMessage?: string): RequestResponse<never> => ({
	code: 201,
	status: 'success',
	message,
	subMessage,
	data: undefined,
});

const badRequestError = (subMessage?: string): RequestResponse<never> => ({
	code: 400,
	status: 'error',
	message: 'Paramètres invalides.',
	subMessage,
	data: undefined,
});

const notFoundError = (subMessage?: string): RequestResponse<never> => ({
	code: 404,
	status: 'error',
	message: 'Ressource inexistante.',
	subMessage,
	data: undefined,
});

const conflictError = (subMessage?: string): RequestResponse<never> => ({
	code: 409,
	status: 'error',
	message: 'Conflit',
	subMessage,
	data: undefined,
});

const internalError: RequestResponse<never> = {
	code: 500,
	status: 'error',
	message: 'Erreur du service interne.',
	subMessage: 'Veuillez contacter le support si cette erreur persiste.',
	data: undefined,
};

const handleRequestTable: { [key: string]: RequestResponse<never>[] } = {
	login: [okResponse('Connexion réussie.'), badRequestError()],
	register: [createdResponse('Inscription réussie.'), badRequestError(), conflictError()],
	me: [okResponse('Profil récupéré.')],
	getArticles: [okResponse('Articles récupérés.')],
	getLikedArticles: [okResponse('Articles aimés récupérés.')],
	getArticle: [okResponse('Article récupéré.'), notFoundError()],
	getBookmark: [okResponse('Marque-page récupéré.'), notFoundError()],
	getBookmarkArticles: [okResponse('Articles récupérés.')],
	addArticle: [createdResponse('Article créé.'), badRequestError()],
	switchArticleDraftState: [okResponse("Status de l'article changé."), badRequestError()],
	deleteArticle: [okResponse('Article supprimé.'), notFoundError()],
	likeArticle: [okResponse('Article aimé.')],
	unlikeArticle: [okResponse('Article dé-aimé.')],
	getBookmarks: [okResponse('Marque-pages récupérés.')],
	addBookmark: [createdResponse('Marque-page créé.'), badRequestError()],
	updateBookmark: [okResponse('Marque-page modifié.'), badRequestError()],
	deleteBookmark: [okResponse('Marque-page supprimé.')],
	addArticleToBookmark: [okResponse('Article ajouté au marque-page.')],
	removeArticleFromBookmark: [okResponse('Article supprimé du marque-page.')],
	getUserProfil: [okResponse('Profil utilisateur récupéré.'), notFoundError()],
};

const handleRequest = async <Type>({
	request,
	action,
	name,
}: {
	request?: () => Promise<AxiosResponse<Type>>;
	action?: () => { status: number; data: Type | undefined };
	name: string;
}): Promise<RequestResponse<Type>> => {
	try {
		if (!request && !action) throw new Error('handleRequest must be provided of a request or an action');
		const res = request ? await request() : action!();
		console.log(res);
		const output = handleRequestTable[name].find((r) => r.code === res.status);
		return output ? { ...output, data: res.data } : unhandledResponse;
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			const errorCode = error.response ? error.response.status : 0;
			if (errorCode === 500) return internalError;
			const errorMessage = error.response?.data.error || 'No message provided from the backend';
			const frenchErrorMessage = findFrenchMapping(errorMessage);
			const output = handleRequestTable[name].find((r) => r.code === errorCode);
			return output ? { ...output, subMessage: frenchErrorMessage } : unhandledResponse;
		}
		return unknowError;
	}
};

export type { RequestResponse };
export default handleRequest;
