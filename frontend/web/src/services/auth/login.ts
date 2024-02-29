import { servicesURL } from 'services';

const login = async ({ email, password }: { email: string; password: string }) =>
	servicesURL.post<{ token: string }>('/login', {
		email,
		password,
	});

export default login;
