import me from './me';
import { again, out, signIn, up } from './sign';
import { email, password, username } from './update';

const auth = {
	me,
	sign: {
		up,
		in: signIn,
		out,
		again,
	},
	update: {
		password,
		email,
		username,
	},
};

export default auth;
