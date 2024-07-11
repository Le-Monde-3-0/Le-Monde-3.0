import { createContext, useContext } from 'react';

import { Auth } from 'types/auth';
import { Handler } from 'types/handler';
import {
	SignResponse,
	EmptyResponse,
	AuthSignIn,
	AuthSignUp,
	AuthUpdateEmail,
	AuthUpdatePassword,
	AuthUpdateUsername,
	MeResponse,
} from 'types/services';

type AuthContextType = {
	data: Auth;
	methods: {
		sign: {
			up: (params: AuthSignUp) => Promise<Handler<SignResponse>>;
			in: (params: AuthSignIn) => Promise<Handler<SignResponse>>;
			out: () => Promise<Handler<EmptyResponse>>;
			again: () => Promise<Handler<EmptyResponse>>;
		};
		me: () => Promise<Handler<MeResponse>>;
		update: {
			password: (params: AuthUpdatePassword) => Promise<Handler<EmptyResponse>>;
			email: (params: AuthUpdateEmail) => Promise<Handler<EmptyResponse>>;
			username: (params: AuthUpdateUsername) => Promise<Handler<EmptyResponse>>;
		};
	};
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuthContext = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('Context used outside of provider.');
	return context;
};

export type { AuthContextType };
export { useAuthContext };
export default AuthContext;
