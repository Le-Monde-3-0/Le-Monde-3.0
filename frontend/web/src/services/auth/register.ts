import { AxiosResponse } from 'axios';
import { servicesURL } from 'services';

type RegisterRes = {
	created: string;
};

const register = async ({
	email,
	password,
	username,
}: {
	email: string;
	password: string;
	username: string;
}): Promise<AxiosResponse<RegisterRes>> =>
	servicesURL.post('/register', {
		email,
		password,
		username,
	});

export default register;
