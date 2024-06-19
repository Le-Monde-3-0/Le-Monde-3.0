import { AxiosError, AxiosResponse } from 'axios';

const englishErrorMapping = [
	{
		english: 'password is not strong enough',
		french: 'Veuillez renseigner un mot de passe plus complexe.',
	},
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
		french: 'Pas de message renvoyé par le backend.',
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

const notAuthError = (subMessage?: string): RequestResponse<never> => ({
	code: 401,
	status: 'error',
	message: "Vous n'êtes pas connecté.",
	subMessage: undefined,
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
	message: 'Conflit.',
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
	signUp: [createdResponse('Inscription réussie!'), badRequestError(), conflictError()],
	signIn: [okResponse('Connexion réussie!')],
	signAgain: [createdResponse('Bienvenue !')],
	signOut: [okResponse('Vous êtes déconnectés.')],
	searchArticles: [okResponse('Articles trouvés.')],
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
			const errorMessage = error.response?.data.message[0] || 'No message provided from the backend';
			const frenchErrorMessage = findFrenchMapping(errorMessage);
			const output = handleRequestTable[name].find((r) => r.code === errorCode);
			return output ? { ...output, subMessage: frenchErrorMessage } : unhandledResponse;
		}
		return unknowError;
	}
};

export type { RequestResponse };
export default handleRequest;
