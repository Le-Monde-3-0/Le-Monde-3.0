import services from 'services';
import { AuthUpdateEmail, AuthUpdatePassword, AuthUpdateUsername } from 'types/services';
import handle from 'utils/handler/handle';

export const password = (params: AuthUpdatePassword) =>
	handle({
		request: async () => await services.auth.update.password(params),
		name: 'update.passord',
	});

export const email = ({ callback, params }: { callback: (str: string) => void; params: AuthUpdateEmail }) =>
	handle({
		request: async () => {
			const res = await services.auth.update.email(params);
			callback(params.newEmail);
			return res;
		},
		name: 'update.email',
	});

export const username = ({ callback, params }: { callback: (str: string) => void; params: AuthUpdateUsername }) =>
	handle({
		request: async () => {
			const res = await services.auth.update.username(params);
			callback(params.newUsername);
			return res;
		},
		name: 'update.username',
	});
