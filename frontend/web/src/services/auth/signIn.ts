import { servicesURL } from 'services';
import { SignType } from 'types/services';

const signIn = async ({ identifier, password }: { identifier: string; password: string }) =>
	servicesURL.post<SignType>('/authentication/sign-in', {
		email: identifier,
		password,
	});

export default signIn;
