import me from './me';
import { again, up, out, signIn } from './sign';
import { password, email, username } from './update';

const auth = {
	sign: {
		up,
		in: signIn,
		out,
		again,
	},
	me,
	update: {
		password,
		email,
		username,
	},
};

export default auth;
