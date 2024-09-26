import { again, up, out, signIn } from './sign';

const auth = {
	sign: {
		up,
		in: signIn,
		out,
		again,
	},
};

export default auth;
