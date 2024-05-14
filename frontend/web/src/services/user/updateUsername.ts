import { servicesURL } from 'services';

const updateUsername = async ({ token, newUsername }: { token: string; newUsername: string }) =>
	servicesURL.patch(
		'/users/username',
		{
			newUsername,
		},
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

export default updateUsername;
