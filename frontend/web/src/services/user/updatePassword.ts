import { servicesURL } from 'services';

const updatePassword = async ({
	token,
	currentPassword,
	newPassword,
}: {
	token: string;
	currentPassword: string;
	newPassword: string;
}) =>
	servicesURL.patch(
		'/users/password',
		{
			currentPassword,
			newPassword,
		},
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

export default updatePassword;
