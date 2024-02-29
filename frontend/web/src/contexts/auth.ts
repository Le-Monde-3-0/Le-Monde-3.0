import { createContext, useContext } from 'react';

import { RequestResponse } from 'utils/handleRequest';

type AuthContextType = {
	//
	// Data stored
	//
	auth: {
		accessToken: string | undefined;
	};

	//
	// Methods to manipulate data stored
	//
	clearAuth: () => void;
	setAccessToken: (accessToken: string) => void;

	//
	// Methods to interact with the services
	//
	login: ({ email, password }: { email: string; password: string }) => Promise<RequestResponse>;
	register: ({
		email,
		username,
		password,
	}: {
		email: string;
		username: string;
		password: string;
	}) => Promise<RequestResponse>;
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
