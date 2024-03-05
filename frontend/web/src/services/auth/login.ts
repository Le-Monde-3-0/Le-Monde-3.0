import { servicesURL } from 'services';
import { LoginType } from 'types/services';

const login = async ({ email, password }: { email: string; password: string }) =>
	servicesURL.post<LoginType>('/login', {
		email,
		password,
	});

export default login;
