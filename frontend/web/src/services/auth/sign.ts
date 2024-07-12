import { servicesURL } from 'services';
import { EmptyResponse, AuthSignIn, SignResponse, AuthSignUp } from 'types/services';

export const up = async (params: AuthSignUp) =>
	servicesURL.post<SignResponse>('/authentication/sign-up', {
		email: params.email,
		password: params.password,
		username: params.username,
	});

export const signIn = async (params: AuthSignIn) =>
	servicesURL.post<SignResponse>('/authentication/sign-in', {
		email: params.identifier,
		password: params.password,
	});

export const out = async () => servicesURL.delete<EmptyResponse>('/authentication/revoke-token');

export const again = async () => servicesURL.post<EmptyResponse>('/authentication/refresh-token');
