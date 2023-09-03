import { servicesURL } from 'services';

const login = async ({ email, password }: { email: string; password: string }) =>
	servicesURL.post('/...', {
		email,
		password,
	});

export default login;
