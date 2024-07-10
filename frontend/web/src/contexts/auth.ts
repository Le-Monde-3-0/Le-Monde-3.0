import { createContext, useContext } from 'react';

import { Handler } from 'types/handler';
import {
	SignResponse,
	EmptyResponse,
	AuthSignIn,
	AuthSignUp,
	AuthUpdateEmail,
	AuthUpdatePassword,
	AuthUpdateUsername,
} from 'types/services';

// type Action<Type> = {
// 	params: Type;
// 	overrides?: {
// 		showIfSuccess?: boolean;
// 		showIfNotSuccess?: boolean;
// 	};
// 	callback?: () => void;
// };

type AuthContextType = {
	methods: {
		sign: {
			up: (params: AuthSignUp) => Promise<Handler<SignResponse>>;
			in: (params: AuthSignIn) => Promise<Handler<SignResponse>>;
			out: () => Promise<Handler<EmptyResponse>>;
			again: () => Promise<Handler<EmptyResponse>>;
		};
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
