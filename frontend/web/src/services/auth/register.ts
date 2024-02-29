import { servicesURL } from 'services';

const register = async ({ email, password, username }: { email: string; password: string; username: string }) =>
	servicesURL.post<Record<string, never>>('/register', {
		email,
		password,
		username,
	});

export default register;
