import { HOST, PORT, BACKEND_URL } from 'config/env';

const context = {
	config: {
		env: {
			HOST,
			PORT,
			BACKEND_URL,
		},
	},
};

export default context;
