import { again, out, signIn, up } from './sign';

const auth = {
	sign: {
		up,
		in: signIn,
		out,
		again,
	},
};

export default auth;
