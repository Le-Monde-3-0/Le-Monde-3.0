import { servicesURL } from 'services';

const register = async ({ email, password, username }: { email: string; password: string; username: string }) =>
	servicesURL.post('/register', {
		email,
		password,
		username,
	});

export default register;
