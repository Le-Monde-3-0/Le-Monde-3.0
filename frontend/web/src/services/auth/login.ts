import { AxiosResponse } from 'axios';
import { servicesURL } from 'services';

type LoginRes = {
	token: string;
};

const login = async ({ email, password }: { email: string; password: string }): Promise<AxiosResponse<LoginRes>> =>
	servicesURL.post('/login', {
		email,
		password,
	});

export default login;
