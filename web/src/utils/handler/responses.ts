import { Handler } from 'types/handler';

export const noResponse: Handler<never> = {
	code: -1,
	status: 'warning',
	message: 'No response.',
	subMessage: 'You might be censored...',
	data: undefined,
};

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

export const okResponse = (message?: string, subMessage?: string): Handler<never> => ({
	code: 200,
	status: 'success',
	message: message || 'Ressource récupérée.',
	subMessage,
	data: undefined,
});

export const createdResponse = (message?: string, subMessage?: string): Handler<never> => ({
	code: 201,
	status: 'success',
	message: message || 'Ressource créé.',
	subMessage,
	data: undefined,
});

export const badRequestError = (message?: string, subMessage?: string): Handler<never> => ({
	code: 400,
	status: 'error',
	message: message || 'Paramètres invalides.',
	subMessage,
	data: undefined,
});

export const notAuthError = (message?: string, subMessage?: string): Handler<never> => ({
	code: 401,
	status: 'error',
	message: message || "Vous n'êtes pas connecté.",
	subMessage,
	data: undefined,
});

export const notFoundError = (message?: string, subMessage?: string): Handler<never> => ({
	code: 404,
	status: 'error',
	message: message || 'Ressource inexistante.',
	subMessage,
	data: undefined,
});

export const conflictError = (message?: string, subMessage?: string): Handler<never> => ({
	code: 409,
	status: 'error',
	message: message || 'Conflit.',
	subMessage,
	data: undefined,
});

export const internalError = (message?: string, subMessage?: string): Handler<never> => ({
	code: 500,
	status: 'error',
	message: message || 'Erreur du service interne.',
	subMessage,
	data: undefined,
});
