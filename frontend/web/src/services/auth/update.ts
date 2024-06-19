import { servicesURL } from 'services';
import { SignType } from 'types/services';

const updatePassword = async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
	servicesURL.patch<SignType>('/authentication/password', {
		oldPassword,
		newPassword,
	});

const updateEmail = async ({ newEmail }: { newEmail: string }) =>
	servicesURL.patch<SignType>('/authentication/email', {
		newEmail,
	});

const updateUsername = async ({ newUsername }: { newUsername: string }) =>
	servicesURL.patch<SignType>('/authentication/username', {
		newUsername,
	});

export { updatePassword, updateEmail, updateUsername };
