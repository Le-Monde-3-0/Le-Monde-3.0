import { servicesURL } from 'services';
import { EmptyResponse, AuthUpdateEmail, AuthUpdatePassword, AuthUpdateUsername } from 'types/services';

export const password = async (params: AuthUpdatePassword) =>
	servicesURL.patch<EmptyResponse>('/authentication/password', {
		oldPassword: params.oldPassword,
		newPassword: params.newPassword,
	});

export const email = async (params: AuthUpdateEmail) =>
	servicesURL.patch<EmptyResponse>('/authentication/email', {
		newEmail: params.newEmail,
	});

export const username = async (params: AuthUpdateUsername) =>
	servicesURL.patch<EmptyResponse>('/authentication/username', {
		newUsername: params.newUsername,
	});
