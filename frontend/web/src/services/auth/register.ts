import { servicesURL } from 'services';
import { EmptyType } from 'types/services';

const register = async ({ email, password, username }: { email: string; password: string; username: string }) =>
	servicesURL.post<EmptyType>('/register', {
		email,
		password,
		username,
	});

export default register;
