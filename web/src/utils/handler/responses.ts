import { Handler } from 'types/handler';

export const noResponse: Handler<never> = {
	code: 1,
	status: 'warning',
	data: undefined,
};

export const unknowError: Handler<never> = {
	code: 2,
	status: 'warning',
	data: undefined,
};

export const unhandledResponse: Handler<never> = {
	code: 3,
	status: 'warning',
	data: undefined,
};

export const okResponse = (message?: string): Handler<never> => ({
	code: 200,
	status: 'success',
	message,
	data: undefined,
});

export const createdResponse = (message?: string): Handler<never> => ({
	code: 201,
	status: 'success',
	message,
	data: undefined,
});

export const badRequestError = (message?: string): Handler<never> => ({
	code: 400,
	status: 'error',
	message,
	data: undefined,
});

export const notAuthError = (message?: string): Handler<never> => ({
	code: 401,
	status: 'error',
	message,
	data: undefined,
});

export const notFoundError = (message?: string): Handler<never> => ({
	code: 404,
	status: 'error',
	message,
	data: undefined,
});

export const conflictError = (message?: string): Handler<never> => ({
	code: 409,
	status: 'error',
	message,
	data: undefined,
});

export const internalError = (message?: string): Handler<never> => ({
	code: 500,
	status: 'error',
	message,
	data: undefined,
});

const responses: { [key: number]: (message?: string) => Handler<never> } = {
	200: okResponse,
	201: createdResponse,
	400: badRequestError,
	401: notAuthError,
	404: notFoundError,
	409: conflictError,
	500: internalError,
};

export default responses;
