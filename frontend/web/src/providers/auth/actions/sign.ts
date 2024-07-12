import services from 'services';
import { AuthSignIn, AuthSignUp } from 'types/services';
import handle from 'utils/handler/handle';

export const up = (params: AuthSignUp) =>
	handle({
		request: async () => await services.auth.sign.up(params),
		name: 'sign.up',
	});

export const signIn = async (params: AuthSignIn) =>
	handle({
		request: async () => await services.auth.sign.in(params),
		name: 'sign.in',
	});

export const out = async () =>
	handle({
		request: async () => await services.auth.sign.out(),
		name: 'sign.out',
	});

export const again = async () =>
	handle({
		request: async () => await services.auth.sign.again(),
		name: 'sign.again',
	});
