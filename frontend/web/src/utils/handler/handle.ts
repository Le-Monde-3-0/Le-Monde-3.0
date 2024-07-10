import { AxiosError, AxiosResponse } from 'axios';

import { Handler } from 'types/handler';
import table from './table';
import translateToFrench from './translate';
import { unhandledResponse, internalError, unknowError } from './responses';

const handle = async <Type>({
	request,
	action,
	name,
}: {
	request?: () => Promise<AxiosResponse<Type>>;
	action?: () => { status: number; data: Type | undefined };
	name: string;
}): Promise<Handler<Type>> => {
	try {
		if (!request && !action) throw new Error('handler must be provided of a request or an action');
		const res = request ? await request() : action!();
		console.log(res);
		const output = table[name].find((r) => r.code === res.status);
		return output ? { ...output, data: res.data } : unhandledResponse;
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			const errorCode = error.response ? error.response.status : 0;
			if (errorCode === 500) return internalError;
			const errorMessage = error.response?.data.message[0] || 'No message provided from the backend';
			const frenchErrorMessage = translateToFrench(errorMessage);
			const output = table[name].find((r) => r.code === errorCode);
			return output ? { ...output, subMessage: frenchErrorMessage } : unhandledResponse;
		}
		return unknowError;
	}
};

export default handle;
