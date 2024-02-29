import { AxiosError, AxiosResponse } from 'axios';

type RequestResponse = {
	code: number;
	status: 'error' | 'info' | 'warning' | 'success' | 'loading';
	message: string;
	subMessage: string | undefined;
};

const handleRequestTable: { [key: string]: RequestResponse[] } = {
	login: [
		{
			code: 200,
			status: 'success',
			message: 'Connexion réussie',
			subMessage: undefined,
		},
		{
			code: 400,
			status: 'error',
			message: 'Paramètres invalides.',
			subMessage: undefined,
		},
	],
	register: [
		{
			code: 201,
			status: 'success',
			message: 'Inscription réussie',
			subMessage: undefined,
		},
		{
			code: 400,
			status: 'error',
			message: 'Paramètres invalides.',
			subMessage: undefined,
		},
	],
};

const unkownAxiosResponse: RequestResponse = {
	code: 0,
	status: 'info',
	message: 'status code unhandled',
	subMessage: undefined,
};

const internalError: RequestResponse = {
	code: 500,
	status: 'error',
	message: 'Erreur du service interne.',
	subMessage: undefined,
};

const unknowError: RequestResponse = {
	code: 0,
	status: 'info',
	message: 'error unhandled',
	subMessage: undefined,
};

const handleRequest = async ({
	request,
	requestName,
}: {
	request: () => Promise<AxiosResponse>;
	requestName: string;
}): Promise<RequestResponse> => {
	try {
		const res = await request();
		const output = handleRequestTable[requestName].find((r) => r.code === res.status);
		return output || unkownAxiosResponse;
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
