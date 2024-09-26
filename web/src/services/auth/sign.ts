import { servicesURL } from 'services';
import { ParamsAuthSignUp, ResponseAuthSign, ParamsAuthSignIn, ResponseEmpty } from 'types/services';

export const up = async (params: ParamsAuthSignUp) =>
	servicesURL.post<ResponseAuthSign>('/authentication/sign-up', {
		email: params.email,
		password: params.password,
		username: params.username,
	});

export const signIn = async (params: ParamsAuthSignIn) =>
	servicesURL.post<ResponseAuthSign>('/authentication/sign-in', {
		email: params.identifier,
		password: params.password,
	});

export const out = async () => servicesURL.delete<ResponseEmpty>('/authentication/revoke-token');

export const again = async () => servicesURL.post<ResponseEmpty>('/authentication/refresh-token');
