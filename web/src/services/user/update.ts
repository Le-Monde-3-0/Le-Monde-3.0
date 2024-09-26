import { servicesURL } from 'services';
import { ParamsUserUpdatePassword, ResponseEmpty } from 'types/services';

export const password = async (params: ParamsUserUpdatePassword) =>
	servicesURL.patch<ResponseEmpty>('/authentication/password', {
		oldPassword: params.oldPassword,
		newPassword: params.newPassword,
	});

export const email = async (newEmail: string) =>
	servicesURL.patch<ResponseEmpty>('/authentication/email', {
		newEmail,
	});

export const username = async (newUsername: string) =>
	servicesURL.patch<ResponseEmpty>('/user/username', {
		newUsername,
	});
