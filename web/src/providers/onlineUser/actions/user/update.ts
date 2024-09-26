import services from 'services';
import { ParamsUserUpdatePassword } from 'types/services';
import handle from 'utils/handler/handle';

export const password = (params: ParamsUserUpdatePassword) =>
	handle(async () => await services.user.update.password(params));

export const email = ({ newEmail, callback }: { newEmail: string; callback: (str: string) => void }) =>
	handle(async () => {
		const res = await services.user.update.email(newEmail);
		callback(newEmail);
		return res;
	});

export const username = ({ newUsername, callback }: { newUsername: string; callback: (str: string) => void }) =>
	handle(async () => {
		const res = await services.user.update.username(newUsername);
		callback(newUsername);
		return res;
	});
