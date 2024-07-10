import { Handler } from 'types/handler';

export const unknowError: Handler<never> = {
	code: 0,
	status: 'info',
	message: 'Non-axios error.',
	subMessage: "This message should't appear.",
	data: undefined,
};

export const unhandledResponse: Handler<never> = {
	code: 1,
	status: 'info',
	message: 'Status code unhandled.',
	subMessage: "This message shouldn't appear.",
	data: undefined,
};

export const okResponse = (message: string, subMessage?: string): Handler<never> => ({
	code: 200,
	status: 'success',
	message,
	subMessage,
	data: undefined,
});

export const createdResponse = (message: string, subMessage?: string): Handler<never> => ({
	code: 201,
	status: 'success',
	message,
	subMessage,
	data: undefined,
});

export const badRequestError = (subMessage?: string): Handler<never> => ({
	code: 400,
	status: 'error',
	message: 'Paramètres invalides.',
	subMessage,
	data: undefined,
});

export const notAuthError = (subMessage?: string): Handler<never> => ({
	code: 401,
	status: 'error',
	message: "Vous n'êtes pas connecté.",
	subMessage: undefined,
	data: undefined,
});

export const notFoundError = (subMessage?: string): Handler<never> => ({
	code: 404,
	status: 'error',
	message: 'Ressource inexistante.',
	subMessage,
	data: undefined,
});

export const conflictError = (subMessage?: string): Handler<never> => ({
	code: 409,
	status: 'error',
	message: 'Conflit.',
	subMessage,
	data: undefined,
});

export const internalError: Handler<never> = {
	code: 500,
	status: 'error',
	message: 'Erreur du service interne.',
	subMessage: 'Veuillez contacter le support si cette erreur persiste.',
	data: undefined,
};
