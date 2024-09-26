import services from 'services';
import { ParamsAuthSignIn, ParamsAuthSignUp } from 'types/services';
import handle from 'utils/handler/handle';

export const up = (params: ParamsAuthSignUp) => handle(async () => await services.auth.sign.up(params));

export const signIn = async (params: ParamsAuthSignIn) => handle(async () => await services.auth.sign.in(params));

export const out = async (callback: () => void) =>
	handle(async () => {
		const res = await services.auth.sign.out();
		callback();
		return res;
	});

export const again = async () => handle(async () => await services.auth.sign.again());
