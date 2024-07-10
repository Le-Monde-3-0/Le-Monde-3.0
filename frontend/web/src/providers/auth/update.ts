import services from 'services';
import { AuthUpdateEmail, AuthUpdatePassword, AuthUpdateUsername } from 'types/services';
import handle from 'utils/handler/handle';

export const password = (params: AuthUpdatePassword) =>
	handle({
		request: async () => await services.auth.update.password(params),
		name: 'update.passord',
	});

export const email = (params: AuthUpdateEmail) =>
	handle({
		request: async () => await services.auth.update.email(params),
		name: 'update.email',
	});

export const username = (params: AuthUpdateUsername) =>
	handle({
		request: async () => await services.auth.update.username(params),
		name: 'update.username',
	});
