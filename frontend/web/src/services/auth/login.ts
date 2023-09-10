import { servicesURL } from 'services';

const login = async ({ email, password }: { email: string; password: string }) =>
	servicesURL.post('/login', {
		email,
		password,
	});

export default login;
