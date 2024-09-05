import { AxiosError, AxiosResponse } from 'axios';

import services from 'services';
import { Handler } from 'types/handler';
import table from './table';
import translateToFrench from './translate';
import { unhandledResponse, internalError, unknowError, noResponse } from './responses';

const getErrorCode = (error: AxiosError) => (error.response ? error.response.status : 0);

const successCase = <Type>({
	name,
	res,
}: {
	name: string;
	res: {
		status: number;
		data: Type | undefined;
	};
}) => {
	const output = table[name].find((r) => r.code === res.status);
	return output ? { ...output, data: res.data } : unhandledResponse;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorCase = ({ name, error }: { name: string; error: AxiosError<any, any> }) => {
	if (error.code === 'ERR_NETWORK') return noResponse;
	const errorCode = getErrorCode(error);
	const errorMessage = error.response?.data.message;
	const frenchErrorMessage = translateToFrench(errorMessage) || 'No message from the backend.';
	if (errorCode === 500) return internalError(undefined, frenchErrorMessage);
	const output = table[name].find((r) => r.code === errorCode);
	return output ? { ...output, subMessage: frenchErrorMessage } : unhandledResponse;
};

const handle = async <Type>({
	request,
	name,
}: {
	request: () => Promise<AxiosResponse<Type>>;
	name: string;
}): Promise<Handler<Type>> => {
	try {
		const res = await request();
		console.log(res);
		return successCase({ name, res });
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
					return successCase({ name, res });
				} catch (refreshError) {
					console.log(refreshError);
					if (refreshError instanceof AxiosError) return errorCase({ name, error: refreshError });
					return unknowError;
				}
			}
			return errorCase({ name, error });
		}
		return unknowError;
	}
};

export default handle;
