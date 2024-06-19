import { servicesURL } from 'services';
import { SignType } from 'types/services';

const signUp = async ({ email, password, username }: { email: string; password: string; username: string }) =>
	servicesURL.post<SignType>('/authentication/sign-up', {
		email,
		password,
		username,
	});

export default signUp;
