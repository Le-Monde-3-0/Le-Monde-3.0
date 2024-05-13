import { servicesURL } from 'services';
import { LoginType } from 'types/services';

const login = async ({ identifier, password }: { identifier: string; password: string }) =>
	servicesURL.post<LoginType>('/login', {
		identifier,
		password,
	});

export default login;
