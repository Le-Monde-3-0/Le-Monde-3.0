import { AxiosError, AxiosResponse } from 'axios';

import services from 'services';
import { Handler } from 'types/handler';
import translateToFrench from './translate';
import responses, { unhandledResponse, unknowError, noResponse } from './responses';

const getErrorCode = (error: AxiosError): number => (error.response ? error.response.status : 0);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getErrorMessage = (error: AxiosError<any, any>): string => error.response?.data.message;
const findResponse = (status: number, message?: string): Handler<never> | undefined =>
	responses[status] ? responses[status](message) : undefined;

const successCase = <Type>(res: { status: number; data: Type | undefined }): Handler<Type> => {
	const output = findResponse(res.status);
	return output ? { ...output, data: res.data } : unhandledResponse;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorCase = (error: AxiosError<any, any>): Handler<never> => {
	if (error.code === 'ERR_NETWORK') return noResponse;
	const errorCode = getErrorCode(error);
	const errorMessage = getErrorMessage(error);
	const frenchErrorMessage = translateToFrench(errorMessage) || 'No message from the backend.';
	const output = findResponse(errorCode, frenchErrorMessage);
	return output ? { ...output, message: frenchErrorMessage } : unhandledResponse;
};

const handle = async <Type>(request: () => Promise<AxiosResponse<Type>>): Promise<Handler<Type>> => {
	try {
		const res = await request();
		console.log(res);
		return successCase(res);
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			if (getErrorCode(error) === 401 && request !== undefined) {
				try {
					console.log('Attempt to refresh token...');
					const refreshRes = await services.auth.sign.again();
					console.log('... token refreshed !');
					console.log(refreshRes);
					const res = await request();
					console.log(res);
					return successCase(res);
				} catch (refreshError) {
					console.log(refreshError);
					if (refreshError instanceof AxiosError) return errorCase(refreshError);
					return unknowError;
				}
			}
			return errorCase(error);
		}
		return unknowError;
	}
};

export default handle;
